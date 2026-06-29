import mongoose, { Schema } from "mongoose";
import { QuestionSet } from "./questionset.model.js";

const submittedTestsSchema = new Schema(
  {
    questionSetId: {
      type: Schema.Types.ObjectId,
      ref: "QuestionSet",
      required: true,
    },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    score: { type: Number, required: true },
  },
  { timestamps: true }
);

submittedTestsSchema.methods.getRankAndTotal = async function () {
  const results = await this.constructor.aggregate([
    {
      $match: {
        questionSetId: this.questionSetId,
      },
    },
    {
      $group: {
        _id: null,
        totalCount: { $sum: 1 },
        position: {
          $sum: {
            $cond: [{ $gt: ["$score", this.score] }, 1, 0],
          },
        },
      },
    },
  ]);

  if (results.length === 0) {
    return {
      rank: 1,
      totalCount: 1,
    };
  }

  const { position, totalCount } = results[0];

  return {
    rank: position + 1,
    totalCount,
  };
};

submittedTestsSchema.statics.getTopRanks = async function (
  questionSetId,
  limit = 5
) {
  return this.aggregate([
    {
      $match: {
        questionSetId: new mongoose.Types.ObjectId(questionSetId),
      },
    },
    {
      $setWindowFields: {
        partitionBy: "$questionSetId",
        sortBy: { score: -1 },
        output: {
          rank: {
            $denseRank: {},
          },
        },
      },
    },
    {
      $sort: { rank: 1 },
    },
    {
      $limit: limit,
    },
    {
      $lookup: {
        from: "users",
        localField: "userId",
        foreignField: "_id",
        as: "user",
      },
    },
    {
      $unwind: "$user",
    },
    {
      $project: {
        rank: 1,
        score: 1,
        createdAt: 1,
        "user.fullName": 1,
        "user._id": 1,
      },
    },
  ]);
};

submittedTestsSchema.statics.getUserBestRank = async function (
  questionSetId,
  userId
) {
  const results = await this.aggregate([
    {
      $match: {
        questionSetId: new mongoose.Types.ObjectId(questionSetId),
      },
    },
    {
      $facet: {
        userBestScore: [
          {
            $match: {
              userId: new mongoose.Types.ObjectId(userId),
            },
          },
          {
            $sort: { score: -1 },
          },
          {
            $limit: 1,
          },
        ],
        allScores: [
          {
            $setWindowFields: {
              partitionBy: "$questionSetId",
              sortBy: { score: -1 },
              output: {
                rank: {
                  $denseRank: {},
                },
              },
            },
          },
        ],
      },
    },
    {
      $project: {
        userSubmitted: { $gt: [{ $size: "$userBestScore" }, 0] },
        userScore: {
          $cond: {
            if: { $gt: [{ $size: "$userBestScore" }, 0] },
            then: {
              rank: {
                $arrayElemAt: [
                  {
                    $filter: {
                      input: "$allScores",
                      as: "score",
                      cond: {
                        $eq: [
                          "$$score.score",
                          { $arrayElemAt: ["$userBestScore.score", 0] },
                        ],
                      },
                    },
                  },
                  0,
                ],
              },
              score: { $arrayElemAt: ["$userBestScore.score", 0] },
            },
            else: null,
          },
        },
      },
    },
    {
      $project: {
        rank: "$userScore.rank.rank",
        score: "$userScore.score",
        userSubmitted: 1,
      },
    },
  ]);

  if (results.length === 0) {
    return {
      userSubmitted: false,
    };
  }

  return {
    userSubmitted: results[0].userSubmitted,
    rank: results[0].rank,
    score: results[0].score,
  };
};

submittedTestsSchema.post("save", async function (doc, next) {
  try {
    await QuestionSet.findByIdAndUpdate(doc.questionSetId, [
      {
        $set: {
          submissionCount: { $add: [{ $ifNull: ["$submissionCount", 0] }, 1] },
          highestScore: {
            $max: [{ $ifNull: ["$highestScore", 0] }, doc.score],
          },
          avgScore: {
            $round: [
              {
                $divide: [
                  {
                    $add: [
                      {
                        $multiply: [
                          { $ifNull: ["$avgScore", 0] },
                          { $ifNull: ["$submissionCount", 0] },
                        ],
                      },
                      doc.score,
                    ],
                  },
                  { $add: [{ $ifNull: ["$submissionCount", 0] }, 1] },
                ],
              },
              2,
            ],
          },
        },
      },
    ]);
  } catch (error) {
    next(error);
  }
});

export const SubmittedTests = mongoose.model(
  "SubmittedTests",
  submittedTestsSchema
);

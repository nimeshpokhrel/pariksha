import { SolvedQuestion } from "../models/solvedQuestion.model.js";
import { Question } from "../models/question.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import convertToMongoId from "../utils/convertToMongoId.js";

const addSolvedQuestion = asyncHandler(async (req, res) => {
  const { questionId } = req.params;

  await SolvedQuestion.findOneAndUpdate(
    { user: req.user._id, question: questionId },
    {},
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Solved question added successfully."));
});

const getPracticeQuestions = asyncHandler(async (req, res) => {
  const { topic, course, subject, unsolved } = req.query;
  const userId = req.user._id;

  // Build match filter based on query params
  const matchFilter = { course: convertToMongoId(course) };
  if (topic) matchFilter.topic = convertToMongoId(topic);
  if (subject) matchFilter.subjectId = convertToMongoId(subject);

  // Build aggregation pipeline
  const pipeline = [{ $match: matchFilter }];

  // If unsolved=true, exclude questions solved by user via $lookup and filtering
  if (unsolved === "true") {
    pipeline.push(
      {
        $lookup: {
          from: "solvedquestions", // MongoDB collection name, adjust if different
          let: { questionId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$question", "$$questionId"] },
                    { $eq: ["$user", userId] },
                  ],
                },
              },
            },
          ],
          as: "solvedForUser",
        },
      },
      {
        $match: {
          solvedForUser: { $size: 0 }, // Only questions NOT solved by user
        },
      }
    );
  }

  // Randomly sample 20 questions from filtered set
  pipeline.push({ $sample: { size: 30 } });

  const questions = await Question.aggregate(pipeline);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        questions,
        "Practice questions fetched successfully."
      )
    );
});

export { addSolvedQuestion, getPracticeQuestions };

import { QuestionSet } from "../models/questionset.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Course } from "../models/course.model.js";
import { SubmittedTests } from "../models/submittedtests.model.js";

const getAllQuestionSets = asyncHandler(async (req, res) => {
  const questionSets = await QuestionSet.find({});

  return res
    .status(200)
    .json(
      new ApiResponse(200, questionSets, "Question sets fetched successfully.")
    );
});

const getQuestionSet = asyncHandler(async (req, res) => {
  const { link, courseLink } = req.params;

  const course = await Course.findOne({ link: courseLink });

  const questionSet = await QuestionSet.findOne({
    link: link,
    course: course._id,
  })
    .select("subjects submissionCount title course avgScore")
    .populate({
      path: "subjects",
      populate: {
        path: "questions",
        select: "-correctAnswer -hint -solution",
      },
    });

  const topRanks = await SubmittedTests.getTopRanks(questionSet._id);

  let userSubmissionData = {};

  if (req.user) {
    userSubmissionData = await SubmittedTests.getUserBestRank(
      questionSet._id,
      req.user._id
    );
  }
  if (!questionSet) {
    throw new ApiError(404, "Question set not found.");
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        questionSet,
        topRanks,
        userSubmissionData,
      },
      "Question set fetched successfully."
    )
  );
});

const submitTestAnswers = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { answers } = req.body;

  const questionSet = await QuestionSet.findById(id).populate({
    path: "subjects",
    populate: {
      path: "questions",
    },
  });

  if (!questionSet) {
    throw new ApiError(404, "Question set not found.");
  }
  let userScore = 0;
  let count = 0;

  const userSummary = questionSet.subjects.map((subject) => {
    let subjectScore = 0;
    let subjectQuestionCount = 0;
    const summary = subject.questions.map((question) => {
      count++;
      subjectQuestionCount++;
      if (question.correctAnswer == answers[question._id]) {
        userScore += 1;
        subjectScore += 1;
      }
      return { question: question, userAnswer: answers[question._id] };
    });
    return {
      subject: subject.name,
      questions: summary,
      subjectMarks: subjectScore,
      subjectTotalMarks: subjectQuestionCount,
    };
  });

  const submittedTest = await SubmittedTests.create({
    questionSetId: id,
    userId: req.user._id,
    score: userScore,
  });

  const { rank, totalCount } = await submittedTest.getRankAndTotal();
  const topRanks = await SubmittedTests.getTopRanks(id);
  const percentile = 100 - (rank * 100) / totalCount;
  const avgScore =
    (questionSet.avgScore + userScore) / (questionSet.submissionCount + 1);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        userScore,
        totalMarks: count,
        userSummary,
        topRanks,
        avgScore,
        percentile: parseFloat(percentile < 0 ? 0 : percentile.toFixed(2)),
        userRank: `${rank} / ${totalCount}`,
      },
      `Test results submitted successfully`
    )
  );
});

export { getAllQuestionSets, getQuestionSet, submitTestAnswers };

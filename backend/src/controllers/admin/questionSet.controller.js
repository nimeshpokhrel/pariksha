import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { QuestionSet } from "../../models/questionset.model.js";
import { Course } from "../../models/course.model.js";
import { QuestionSubject } from "../../models/questionsubject.model.js";
import convertToMongoId from "../../utils/convertToMongoId.js";
import { deleteQuestionSetFunc } from "../../functions/deleteFunctions.js";

const getQuestionSet = asyncHandler(async (req, res) => {
  const { _id } = req.params;

  const questionSet = await QuestionSet.findById(_id)
    .select("highestScore subjects title")
    .populate({
      path: "subjects",
    });

  if (!questionSet) {
    throw new ApiError(404, "Question set not found.");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, questionSet, "Question set fetched successfully.")
    );
});

const createQuestionSet = asyncHandler(async (req, res) => {
  const { title, description, link, number, courseId, setType } = req.body;

  if ([title, link, setType].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "All fields are required.");
  }

  if (setType !== "past" && setType !== "mock") {
    throw new ApiError(400, "Type must be either past or mock");
  }

  const questionSet = await QuestionSet.create({
    title,
    link,
    description,
    number,
    setType,
    course: courseId,
  });

  const course = await Course.findByIdAndUpdate(
    courseId,
    { $push: { questionSets: questionSet._id } },
    { new: true }
  ).populate("subjects");

  const questionSubjects = await Promise.all(
    course.subjects.map(async (subject) => {
      const questionSubject = await QuestionSubject.create({
        name: subject.title,
        subject: subject._id,
        course: courseId,
        questionSet: questionSet._id,
      });
      return questionSubject._id;
    })
  );
  const updatedQuestionSet = await QuestionSet.findByIdAndUpdate(
    questionSet._id,
    {
      $set: { subjects: questionSubjects },
    },
    { new: true }
  );

  return res
    .status(200)
    .json(new ApiResponse(200, updatedQuestionSet, "Question set Created."));
});

const updateQuestionSetsArray = asyncHandler(async (req, res) => {
  const { _id } = req.params;

  const newArray = req.body;

  const convertedArray = newArray.map((subject) => {
    return convertToMongoId(subject);
  });

  const course = await Course.findById(_id);
  if (!course) {
    throw new ApiError(404, "Course not found");
  }
  if (newArray.length === 0) {
    throw new ApiError(400, "Something Went Wrong");
  }

  await Course.findByIdAndUpdate(_id, {
    questionSets: convertedArray,
  });
  return res.status(200).json(new ApiResponse(200, course, "Course updated"));
});

const updateQuestionSet = asyncHandler(async (req, res) => {
  const { _id } = req.params;
  const { title, description, link, number, setType } = req.body;

  const questionSet = await QuestionSet.findByIdAndUpdate(
    _id,
    { title, description, link, number, setType },
    { new: true }
  );

  return res
    .status(200)
    .json(new ApiResponse(200, questionSet, "Question set updated"));
});

const deleteQuestionSet = asyncHandler(async (req, res) => {
  const { courseId, _id } = req.params;

  const questionSet = await QuestionSet.findById(_id);

  if (!questionSet) {
    throw new ApiError(404, "Question set not found");
  }
  await Course.findByIdAndUpdate(
    courseId,
    { $pull: { questionSets: questionSet._id } },
    { new: true }
  );

  deleteQuestionSetFunc(_id);

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Question set deleted successfully"));
});

export {
  createQuestionSet,
  updateQuestionSetsArray,
  deleteQuestionSet,
  updateQuestionSet,
  getQuestionSet,
};

import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { QuestionSet } from "../../models/questionset.model.js";
import { QuestionSubject } from "../../models/questionsubject.model.js";
import convertToMongoId from "../../utils/convertToMongoId.js";
import { deleteQuestionSubjectFunc } from "../../functions/deleteFunctions.js";
import { Topic } from "../../models/topic.model.js";

const getQuestionSubject = asyncHandler(async (req, res) => {
  const { _id } = req.params;

  const questionSubject = await QuestionSubject.findById(_id)
    .select("-topics")
    .populate({
      path: "questions",
    });
  const topics = await Topic.find({ subjectId: questionSubject.subject }).sort({
    name: 1,
  });

  if (!questionSubject) {
    throw new ApiError(404, "Question subject not found.");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { ...questionSubject.toObject(), topics },
        "Question subject fetched successfully."
      )
    );
});

const updateQuestionSubjectsArray = asyncHandler(async (req, res) => {
  const { _id } = req.params;

  const newArray = req.body;

  const convertedArray = newArray.map((id) => {
    return convertToMongoId(id);
  });

  const questionSet = await QuestionSet.findById(_id);
  if (!questionSet) {
    throw new ApiError(404, "Course not found");
  }
  if (newArray.length === 0) {
    throw new ApiError(400, "Something Went Wrong");
  }

  await QuestionSet.findByIdAndUpdate(_id, {
    subjects: convertedArray,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, questionSet, "Question set updated"));
});

const deleteQuestionSubject = asyncHandler(async (req, res) => {
  const { _id } = req.params;

  const questionSubject = await QuestionSubject.findById(_id);

  if (!questionSubject) {
    throw new ApiError(404, "Question subject not found");
  }

  deleteQuestionSubjectFunc(_id);

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Question set deleted successfully"));
});

export {
  updateQuestionSubjectsArray,
  deleteQuestionSubject,
  getQuestionSubject,
};

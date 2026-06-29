import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiError } from "../../utils/ApiError.js";

import { Subject } from "../../models/subject.model.js";
import { Course } from "../../models/course.model.js";
import { QuestionSubject } from "../../models/questionsubject.model.js";

import { ApiResponse } from "../../utils/ApiResponse.js";
import convertToMongoId from "../../utils/convertToMongoId.js";
import { deleteSubjectFunc } from "../../functions/deleteFunctions.js";
import { QuestionSet } from "../../models/questionset.model.js";

const createSubject = asyncHandler(async (req, res) => {
  const { title, courseId, duration, link, image } = req.body;

  if ([title, courseId, link].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "All fields are required.");
  }

  const course = await Course.findById(courseId);

  const subject = await Subject.create({
    title,
    link,
    course: course._id,
    videoCount: 0,
    duration,
    image,
  });
  const createdSubject = await Subject.findById(subject._id);
  if (!createdSubject) {
    throw new ApiError(500, "Something went wrong while creating the subject.");
  }

  const updatedCourse = await Course.findByIdAndUpdate(
    courseId,
    { $push: { subjects: createdSubject._id } },
    { new: true }
  );

  updatedCourse.questionSets.forEach(async (questionSet) => {
    const createdQuestionSubject = await QuestionSubject.create({
      name: createdSubject.title,
      subject: createdSubject._id,
      course: course._id,
      questionSet: questionSet._id,
    });
    await QuestionSet.findByIdAndUpdate(
      questionSet._id,
      { $push: { subjects: createdQuestionSubject._id } },
      { new: true }
    );
  });

  if (!updatedCourse) {
    throw new ApiError(500, "Something went wrong while updating the course.");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, createdSubject, "Subject Created"));
});

const updateSubjectsArray = asyncHandler(async (req, res) => {
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
    subjects: convertedArray,
  });
  return res.status(200).json(new ApiResponse(200, course, "Course updated"));
});

const updateSubject = asyncHandler(async (req, res) => {
  const { _id } = req.params;

  const { title, duration, link, image } = req.body;

  const subject = await Subject.findById(_id);
  if (!subject) {
    throw new ApiError(404, "Course not found");
  }

  if ([title, duration, link].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "All fields are required.");
  }

  await Subject.findByIdAndUpdate(_id, {
    title,
    duration,
    link,
    image,
  });

  await QuestionSubject.updateMany({ subject: subject._id }, { name: title });

  return res.status(200).json(new ApiResponse(200, subject, "Course updated"));
});

const deleteSubject = asyncHandler(async (req, res) => {
  const { courseId, _id } = req.params;

  const subject = await Subject.findById(_id);
  if (!subject) {
    throw new ApiError(404, "Subject not found");
  }
  await Course.findByIdAndUpdate(
    courseId,
    { $pull: { subjects: subject._id } },
    { new: true }
  );
  await deleteSubjectFunc(subject._id);

  return res.status(200).json(new ApiResponse(200, {}, "Subject deleted"));
});

const getSubject = asyncHandler(async (req, res) => {
  const { _id } = req.params;

  const subject = await Subject.findById(_id).populate({ path: "sections" });
  if (!subject) {
    throw new ApiError(404, "Subject not found");
  }

  return res.status(200).json(new ApiResponse(200, subject, "Subject fetched"));
});

export {
  createSubject,
  updateSubjectsArray,
  updateSubject,
  deleteSubject,
  getSubject,
};

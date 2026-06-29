import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiError } from "../../utils/ApiError.js";

import { Course } from "../../models/course.model.js";

import { ApiResponse } from "../../utils/ApiResponse.js";
import { deleteCourseFunc } from "../../functions/deleteFunctions.js";
import { QuestionsOfTheDay } from "../../models/questionsOfTheDay.model.js";

const getCourseData = asyncHandler(async (req, res) => {
  const { _id } = req.params;

  const course = await Course.findById(_id)
    .select("-createdAt -updatedAt -__v")
    .populate([
      {
        path: "subjects",
        select: "title duration videoCount link image",
      },
      {
        path: "questionSets",
        select: "title link highestScore setType number",
      },
    ])
    .lean();

  const questionsOfTheDay = await QuestionsOfTheDay.find({
    course: course._id,
  }).sort({ date: -1 });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { ...course, questionsOfTheDay },
        "Courses fetched successfully."
      )
    );
});

const createCourse = asyncHandler(async (req, res) => {
  const { image, title, description, link } = req.body;

  if ([title, description].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "All fields are required.");
  }

  const course = await Course.create({
    image,
    title,
    description,
    link,
  });
  const createdCourse = await Course.findById(course._id);
  if (!createdCourse) {
    throw new ApiError(500, "Something went wrong while creating the course");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, createdCourse, "Course Created"));
});

const deleteCourse = asyncHandler(async (req, res) => {
  const { _id } = req.params;

  const course = await Course.findById(_id);
  if (!course) {
    throw new ApiError(404, "Course not found");
  }
  await deleteCourseFunc(_id);
  return res.status(200).json(new ApiResponse(200, {}, "Course deleted"));
});

const updateCourse = asyncHandler(async (req, res) => {
  const { _id } = req.params;
  const { title, description, link, image } = req.body;

  const course = await Course.findById(_id);
  if (!course) {
    throw new ApiError(404, "Course not found");
  }

  if ([title, description, link].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "All fields are required.");
  }

  await Course.findByIdAndUpdate(_id, {
    title,
    description,
    link,
    image,
  });
  return res.status(200).json(new ApiResponse(200, course, "Course updated"));
});

export { createCourse, deleteCourse, updateCourse, getCourseData };

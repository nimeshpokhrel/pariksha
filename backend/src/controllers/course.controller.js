import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";

import { Course } from "../models/course.model.js";
import { Video } from "../models/video.model.js";
import { Question } from "../models/question.model.js";
import { Subject } from "../models/subject.model.js";
import { Topic } from "../models/topic.model.js";

import { ApiResponse } from "../utils/ApiResponse.js";
import { QuestionsOfTheDay } from "../models/questionsOfTheDay.model.js";
import { EnrolledCourseHistory } from "../models/enrolledCourseHistory.model.js";

const getAllCourses = asyncHandler(async (req, res) => {
  const courses = await Course.find({})
    .populate([
      {
        path: "subjects",
        populate: [
          {
            path: "sections",
            populate: [
              {
                path: "videos",
                select: "title duration",
              },
            ],
          },
        ],
      },
    ])
    .lean();

  const modifiedCourses = await Promise.all(
    courses.map(async (course) => {
      const videoCount = await Video.countDocuments({ course: course._id });

      return {
        ...course,
        subjectCount: course.subjects?.length || 0,
        questionSetCount: course.questionSets?.length || 0,
        videoCount,
      };
    })
  );

  return res
    .status(200)
    .json(
      new ApiResponse(200, modifiedCourses, "Courses fetched successfully.")
    );
});

const getCourseData = asyncHandler(async (req, res) => {
  const { link } = req.params;

  const course = await Course.findOne({ link: link })
    .select("-createdAt -updatedAt -__v -questionSets")
    .populate([
      {
        path: "subjects",
        populate: [
          {
            path: "sections",
            populate: [
              {
                path: "videos",
                select: "title duration",
              },
            ],
          },
        ],
      },
      {
        path: "questionSets",
        select: "-createdAt -updatedAt -__v -course -subjects",
      },
    ])
    .lean();

  if (!course) {
    throw new ApiError(
      404,
      "No course found with the specified link.",
      "course"
    );
  }

  const questionSetsWithCount = await Promise.all(
    (course.questionSets || []).map(async (qs) => {
      const questionCount = await Question.countDocuments({
        questionSet: qs._id,
      });
      return { ...qs, questionCount };
    })
  );

  const videoCount = await Video.countDocuments({ course: course._id });
  const questionsOfTheDay = await QuestionsOfTheDay.find({
    course: course._id,
  })
    .sort({ date: -1 })
    .populate([
      {
        path: "questions",
        select: "subjectId",
        populate: [
          {
            path: "subjectId",
            select: "title",
          },
        ],
      },
    ]);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        ...course,
        questionSets: questionSetsWithCount,
        subjectCount: course.subjects?.length || 0,
        questionSetCount: course.questionSets?.length || 0,
        questionsOfTheDay,
        videoCount,
      },
      "Courses fetched successfully."
    )
  );
});

const getCourseSubjectsAndTopics = asyncHandler(async (req, res) => {
  const { link } = req.params;

  const course = await Course.findOne({ link }).lean();
  if (!course) {
    throw new ApiError(404, "Course not found");
  }

  const subjects = await Subject.find({ course: course._id })
    .select("title _id")
    .lean();

  const topics = await Topic.find({ course: course._id })
    .select("name _id subjectId")
    .lean();

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        course: { _id: course._id, title: course.title, link: course.link },
        subjects,
        topics,
      },
      "Course fetched successfully."
    )
  );
});

const addEnrolledCourseHistory = asyncHandler(async (req, res) => {
  const { _id } = req.params;

  const course = await Course.findById(_id);
  if (!course) {
    throw new ApiError(404, "Course not found");
  }
  const enrolledCourseHistory = await EnrolledCourseHistory.findOne({
    course: course._id,
    user: req.user._id,
  });

  if (enrolledCourseHistory) {
    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Course enrolled successfully"));
  }

  await EnrolledCourseHistory.create({
    course: course._id,
    user: req.user._id,
  });
  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Course enrolled successfully"));
});

export {
  getAllCourses,
  getCourseData,
  addEnrolledCourseHistory,
  getCourseSubjectsAndTopics,
};

import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";

import { Subject } from "../models/subject.model.js";
import { Course } from "../models/course.model.js";
import { User } from "../models/user.model.js";
import { Video } from "../models/video.model.js";

import { ApiResponse } from "../utils/ApiResponse.js";

const getSubjectInfo = asyncHandler(async (req, res) => {
  const { subjectLink } = req.params;

  const subject = await Subject.findOne({ link: subjectLink }).populate([
    {
      path: "sections",
      populate: {
        path: "videos",
      },
    },
    { path: "course", select: "title image" },
  ]);
  if (!subject) {
    throw new ApiError(404, "Subject not found.");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, subject, "Subject fetched successfully."));
});

const updateUserSubjectVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.body;
  const video = await Video.findById(videoId);

  await User.updateOne(
    { _id: req.user?._id },
    { $set: { [`subjectCurrentWatching.${video.subject}`]: videoId } }
  );

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "User subject watching updated."));
});

export { getSubjectInfo, updateUserSubjectVideo };

import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiError } from "../../utils/ApiError.js";

import { Subject } from "../../models/subject.model.js";
import { Section } from "../../models/section.model.js";
import { Video } from "../../models/video.model.js";
import convertToMongoId from "../../utils/convertToMongoId.js";

import { ApiResponse } from "../../utils/ApiResponse.js";
import { deleteVideoFunc } from "../../functions/deleteFunctions.js";

const createVideo = asyncHandler(async (req, res) => {
  const { videoFile, title, duration, sectionId, subjectId, courseId } =
    req.body;

  if ([title, videoFile, sectionId].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "All fields are required.");
  }

  const video = await Video.create({
    title,
    videoFile,
    duration,
    course: courseId,
    subject: subjectId,
    section: sectionId,
  });
  const createdVideo = await Video.findById(video._id);
  if (!createdVideo) {
    throw new ApiError(500, "Something went wrong while creating the video.");
  }

  await Section.findOneAndUpdate(
    { _id: sectionId },
    { $push: { videos: createdVideo._id }, $inc: { videoCount: 1 } },
    { new: true }
  );

  await Subject.findByIdAndUpdate(
    subjectId,
    { $inc: { videoCount: 1 } },
    { new: true }
  );

  return res
    .status(200)
    .json(new ApiResponse(200, createdVideo, "Video Created"));
});

const updateVideosArray = asyncHandler(async (req, res) => {
  const { _id } = req.params;

  const newArray = req.body;

  const convertedArray = newArray.map((video) => {
    return convertToMongoId(video);
  });

  const section = await Section.findById(_id);
  if (!section) {
    throw new ApiError(404, "Section not found");
  }
  if (newArray.length === 0) {
    throw new ApiError(400, "Something Went Wrong");
  }

  await Section.findByIdAndUpdate(_id, {
    videos: convertedArray,
  });
  return res.status(200).json(new ApiResponse(200, section, "Section updated"));
});

const updateVideo = asyncHandler(async (req, res) => {
  const { _id } = req.params;

  const { title, duration, videoFile } = req.body;

  const video = await Video.findById(_id);
  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  if ([title, duration, videoFile].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "All fields are required.");
  }

  await Video.findByIdAndUpdate(_id, {
    title,
    duration,
    videoFile,
  });
  return res.status(200).json(new ApiResponse(200, video, "Course updated"));
});

const deleteVideo = asyncHandler(async (req, res) => {
  const { subjectId, sectionId, _id } = req.params;

  const video = await Video.findById(_id);
  if (!video) {
    throw new ApiError(404, "Video not found");
  }
  const updatedSection = await Section.findByIdAndUpdate(
    sectionId, // The ID of the document to find
    { $pull: { videos: video._id }, $inc: { videoCount: -1 } }, // Remove the specific ObjectId from the `videos` array
    { new: true } // Return the updated document
  );
  if (!updatedSection) {
    throw new ApiError(500, "Something went wrong while updating the section.");
  }

  await Subject.findByIdAndUpdate(
    subjectId,
    { $inc: { videoCount: -1 } },
    { new: true }
  );

  await deleteVideoFunc(_id);
  return res.status(200).json(new ApiResponse(200, video, "Video deleted"));
});

export { createVideo, updateVideo, deleteVideo, updateVideosArray };

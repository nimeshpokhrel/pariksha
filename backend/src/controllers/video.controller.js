import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";

import { Video } from "../models/video.model.js";

import { WatchHistory } from "../models/watchHistory.model.js";

import { User } from "../models/user.model.js";

import { ApiResponse } from "../utils/ApiResponse.js";
import { CompletedVideo } from "../models/completedVideo.model.js";

const getVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  const video = await Video.findById(videoId);

  if (!video) {
    throw new ApiError(404, "Video not found.");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, video, "Video fetched successfully."));
});

const getVideoFullData = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  const video = await Video.findById(videoId)
    .select("title duration course subject section")
    .populate([
      {
        path: "course",
        select: "title description link subjects",
        populate: [
          {
            path: "subjects",
            select: "title",
          },
        ],
      },
      {
        path: "subject",
        select: "title link videoCount duration",
      },
      {
        path: "section",
        select: "title videoCount videos",
      },
    ]);

  if (!video) {
    throw new ApiError(404, "Video not found.");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, video, "Video fetched successfully."));
});

const getWatchHistory = asyncHandler(async (req, res) => {
  const count = req.params.count ? parseInt(req.params.count) : null;
  const user = await User.findById(req.user._id).select("_id");
  const pipeline = [
    { $match: { user: user._id } },
    { $sort: { createdAt: -1 } },
    {
      $group: {
        _id: "$video",
        latestEntry: { $first: "$$ROOT" },
      },
    },
    { $replaceRoot: { newRoot: "$latestEntry" } },
    { $sort: { createdAt: -1 } },
    {
      $project: {
        user: 0,
        __v: 0,
      },
    },
  ];
  if (count) {
    pipeline.push({ $limit: count });
  }
  const history = await WatchHistory.aggregate(pipeline).exec();

  const watchHistory = await WatchHistory.populate(history, {
    path: "video",
    populate: [
      {
        path: "subject",
        select: "title link",
      },
      {
        path: "course",
        select: "title link",
      },
    ],
  });

  return res
    .status(200)
    .json(new ApiResponse(200, watchHistory, "Watch History fetched."));
});

const addToWatchHistory = asyncHandler(async (req, res) => {
  const { videoId } = req.body;

  const video = await Video.findById(videoId).select("_id");

  const watchHistory = await WatchHistory.create({
    user: req.user._id,
    video: video._id,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, watchHistory, "Watch History Added."));
});

const getCompletedVideos = asyncHandler(async (req, res) => {
  const completedVideos = await CompletedVideo.find({ user: req.user._id });
  const completedVideosId =
    completedVideos.length > 0
      ? completedVideos.map((completedVideo) => completedVideo.video)
      : [];

  return res
    .status(200)
    .json(new ApiResponse(200, completedVideosId, "Completed Videos fetched."));
});

const updateUserWatchedVideos = asyncHandler(async (req, res) => {
  const { option, videoId } = req.body;

  if (option === "add") {
    await CompletedVideo.create({
      user: req.user._id,
      video: videoId,
    });
  } else if (option === "remove") {
    await CompletedVideo.deleteOne({
      user: req.user._id,
      video: videoId,
    });
  } else {
    throw new ApiError(400, "Invalid option.");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "User subject watching updated."));
});

export {
  getVideo,
  updateUserWatchedVideos,
  addToWatchHistory,
  getWatchHistory,
  getCompletedVideos,
  getVideoFullData,
};

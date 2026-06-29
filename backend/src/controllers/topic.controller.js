import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Topic } from "../models/topic.model.js";

const getAllTopics = asyncHandler(async (req, res) => {
  const topics = await Topic.find({});

  return res
    .status(200)
    .json(new ApiResponse(200, topics, "Topics fetched successfully."));
});

export { getAllTopics };

import { asyncHandler } from "../utils/asyncHandler.js";
import { College } from "../models/college.model.js";

import { ApiResponse } from "../utils/ApiResponse.js";

const getAllColleges = asyncHandler(async (req, res) => {
  const colleges = await College.find({})
    .populate({
      path: "university",
      select: "name",
    })
    .populate({
      path: "degrees",
      select: "shortName sector",
      sort: { priority: 1 },
    })
    .sort({ priority: 1 });

  return res
    .status(200)
    .json(new ApiResponse(200, colleges, "College fetched successfully."));
});

const getCollegeData = asyncHandler(async (req, res) => {
  const { link } = req.params;

  const college = await College.findOne({
    link: link.trim().toLowerCase(),
  })
    .select("-createdAt -updatedAt -__v")
    .populate({
      path: "university",
      select: "name link",
    })
    .populate({
      path: "degrees",
      sort: { priority: 1 },
      populate: {
        path: "university sector",
        select: "name link",
      },
    });

  return res
    .status(200)
    .json(new ApiResponse(200, college, "College fetched successfully."));
});

export { getAllColleges, getCollegeData };

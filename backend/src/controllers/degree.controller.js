import { asyncHandler } from "../utils/asyncHandler.js";
import { Degree } from "../models/degree.model.js";

import { ApiResponse } from "../utils/ApiResponse.js";
import { College } from "../models/college.model.js";

const getAllDegrees = asyncHandler(async (req, res) => {
  const degrees = await Degree.find({})
    .populate({
      path: "university",
      select: "name link",
    })
    .populate({
      path: "sector",
      select: "name link",
    })
    .sort({ priority: 1 });

  return res
    .status(200)
    .json(new ApiResponse(200, degrees, "Degree fetched successfully."));
});

const getDegreeData = asyncHandler(async (req, res) => {
  const { link } = req.params;

  const degree = await Degree.findOne({
    link: link.trim().toLowerCase(),
  })
    .select("-createdAt -updatedAt -__v")
    .populate({
      path: "university",
      select: "name link",
    })
    .populate({
      path: "sector",
      select: "name link",
    })
    .lean();

  const colleges = await College.find({ degrees: degree._id })
    .populate([
      {
        path: "degrees",
        select: "shortName sector",
        sort: { priority: 1 },
      },
      {
        path: "university",
        select: "name",
      },
    ])

    .sort({
      priority: 1,
    });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { ...degree, colleges },
        "Degree fetched successfully."
      )
    );
});

export { getAllDegrees, getDegreeData };

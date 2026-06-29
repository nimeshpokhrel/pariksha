import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";

import { University } from "../models/university.model.js";

import { ApiResponse } from "../utils/ApiResponse.js";
import { Degree } from "../models/degree.model.js";
import { College } from "../models/college.model.js";

const getAllUniversities = asyncHandler(async (req, res) => {
  const universities = await University.find({});
  return res
    .status(200)
    .json(
      new ApiResponse(200, universities, "Universities fetched successfully.")
    );
});

const getUniversityData = asyncHandler(async (req, res) => {
  const { link } = req.params;

  const university = await University.findOne({ link: link })
    .select("-createdAt -updatedAt -__v")
    .lean();

  const degrees = await Degree.aggregate([
    {
      $match: {
        university: university._id,
      },
    },
    {
      $lookup: {
        from: "sectors",
        localField: "sector",
        foreignField: "_id",
        as: "sector",
      },
    },
    {
      $unwind: "$sector",
    },
    {
      $sort: { priority: 1 }, // Sort degrees by priority
    },
    {
      $group: {
        _id: "$sector._id",
        sectorName: { $first: "$sector.name" },
        sectorLink: { $first: "$sector.link" }, // optional
        minPriority: { $first: "$priority" }, // lowest priority degree in sector
        degrees: {
          $push: {
            _id: "$_id",
            name: "$name",
            shortName: "$shortName",
            duration: "$duration",
            semesterCount: "$semesterCount",
            coverImage: "$coverImage",
            description: "$description",
            priority: "$priority",
            link: "$link",
          },
        },
      },
    },
    {
      $sort: { minPriority: 1 }, // sort sectors by lowest degree priority
    },
  ]);

  const colleges = await College.find({ university: university._id })
    .populate({
      path: "degrees",
      sort: { priority: 1 },
    })
    .sort({
      priority: 1,
    });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { ...university, degrees, colleges },
        "University fetched successfully."
      )
    );
});

export { getAllUniversities, getUniversityData };

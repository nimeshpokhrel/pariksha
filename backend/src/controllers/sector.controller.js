import { asyncHandler } from "../utils/asyncHandler.js";
import { Sector } from "../models/sector.model.js";
import { Degree } from "../models/degree.model.js";

import { ApiResponse } from "../utils/ApiResponse.js";
import { College } from "../models/college.model.js";

const getAllSectors = asyncHandler(async (req, res) => {
  const sectors = await Sector.find({});

  const sectorsWithDegreeCount = await Promise.all(
    sectors.map(async (sector) => {
      const degreesCount = await Degree.countDocuments({ sector: sector._id });
      return {
        ...sector.toObject(),
        degreesCount,
      };
    })
  );

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        sectorsWithDegreeCount,
        "Sectors fetched successfully."
      )
    );
});

const getSectorData = asyncHandler(async (req, res) => {
  const { link } = req.params;

  const sector = await Sector.findOne({ link: link })
    .select("-createdAt -updatedAt -__v")
    .lean();

  const degrees = await Degree.aggregate([
    {
      $match: {
        sector: sector._id,
      },
    },
    {
      $lookup: {
        from: "universities",
        localField: "university",
        foreignField: "_id",
        as: "university",
      },
    },
    {
      $unwind: "$university",
    },
    {
      $sort: { priority: 1 },
    },
    {
      $group: {
        _id: "$university._id",
        universityName: { $first: "$university.name" },
        minPriority: { $first: "$priority" },
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
      $sort: { minPriority: 1 }, // Sort universities by degree priority
    },
  ]);

  const allDegreeIds = degrees
    .flatMap((univ) => univ.degrees)
    .map((degree) => degree._id);

  const colleges = await College.find({
    degrees: { $in: allDegreeIds },
  })
    .populate({
      path: "university",
      select: "name",
    })
    .populate({
      path: "degrees",
      select: "shortName sector",
      sort: { priority: 1 },
    })
    .sort({ priority: 1 })
    .lean();

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { ...sector, degrees, colleges },
        "Sector fetched successfully."
      )
    );
});

export { getAllSectors, getSectorData };

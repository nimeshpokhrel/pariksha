import mongoose from "mongoose";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { User } from "../../models/user.model.js";
import { EnrolledCourseHistory } from "../../models/enrolledCourseHistory.model.js";
import { ApiResponse } from "../../utils/ApiResponse.js";

const getAllUsers = asyncHandler(async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || "";

    const matchQuery = search
      ? {
          $or: [
            { fullName: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } },
            { contactNumber: !isNaN(search) ? Number(search) : null },
          ],
        }
      : {};

    const skip = (page - 1) * limit;

    const pipeline = [
      { $match: matchQuery },
      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: limit },
      {
        $lookup: {
          from: "enrolledcoursehistories",
          localField: "_id",
          foreignField: "user",
          as: "enrolledCourses",
        },
      },
      {
        $unwind: {
          path: "$enrolledCourses",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "courses",
          localField: "enrolledCourses.course",
          foreignField: "_id",
          as: "enrolledCourses.courseDetails",
        },
      },
      {
        $unwind: {
          path: "$enrolledCourses.courseDetails",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $group: {
          _id: "$_id",
          fullName: { $first: "$fullName" },
          email: { $first: "$email" },
          contactNumber: { $first: "$contactNumber" },
          createdAt: { $first: "$createdAt" },
          updatedAt: { $first: "$updatedAt" },
          enrolledCourses: {
            $addToSet: "$enrolledCourses.courseDetails.title",
          },
          adsEnabled: { $first: "$adsEnabled" },
        },
      },
      { $sort: { createdAt: -1 } },
    ];

    // Get paginated users with enrolled courses
    const users = await User.aggregate(pipeline);

    // Count total users for pagination
    const total = await User.countDocuments(matchQuery);

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          users,
          total,
          page,
          pages: Math.ceil(total / limit),
        },
        "Users fetched successfully."
      )
    );
  } catch (error) {
    console.error("Error fetching users:", error);
    return res
      .status(500)
      .json(new ApiResponse(500, null, "Failed to fetch users."));
  }
});

const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  return res.status(200).json(new ApiResponse(200, user, "User fetched"));
});

const changeUserAdsSettings = asyncHandler(async (req, res) => {
  const { _id } = req.params;
  const { adsEnabled } = req.body;

  await User.findByIdAndUpdate(_id, {
    adsEnabled,
  });

  return res.status(200).json(new ApiResponse(200, {}, "User updated"));
});

export { getAllUsers, getUserById, changeUserAdsSettings };

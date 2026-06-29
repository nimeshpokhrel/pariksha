import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

import { CollegeRecommend } from "../models/collegeRecommend.model.js";
import { User } from "../models/user.model.js";
import { Otp } from "../models/otp.model.js";
import { smsSender } from "../utils/smsSender.js";

const addCollegeRecommend = asyncHandler(async (req, res) => {
  const {
    name,
    email,
    contactNumber,
    fees,
    location,
    rank,
    ktmDistrict,
    ktmArea,
    otp,
    coursePreference,
    desiredCollege,
    reputationRequired,
    personalVehicle,
    publicTransport,
    nonCredit,
    extracurricular,
  } = req.body;

  try {
    const existingUser = await User.findOne({
      $or: [{ email: email }, { contactNumber: contactNumber }],
    });

    if (!existingUser) {
      const dbOtp = await Otp.findOne({ identifier: email, otp: otp });
      if (!dbOtp) {
        throw new ApiError(400, "Invalid OTP");
      }
      await Otp.deleteMany({ identifier: email });
      const letters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
      const digits = "0123456789";

      const password = Array(10)
        .fill(letters + digits)
        .map((x) => x[Math.floor(Math.random() * x.length)])
        .join("");

      await User.create({
        contactNumber: contactNumber,
        email: email,
        fullName: name,
        password: password,
        studyLocation: location,
        abroadPlans: false,
      });
      smsSender({
        phone: contactNumber,
        message: `Your account has been created on Pariksha. Your login credentials are Email: ${email} and Password: ${password}. Please change your password after logging in.`,
      });
    }

    await CollegeRecommend.create({
      name,
      email,
      contactNumber,
      fees: `${fees[0]} - ${fees[1]}`,
      location,
      rank,
      ktmDistrict,
      ktmArea,
      coursePreference,
      desiredCollege,
      reputationRequired,
      personalVehicle,
      publicTransport,
      nonCredit,
      extracurricular,
    });
    return res
      .status(200)
      .json(new ApiResponse(200, {}, "College Recommendation Added"));
  } catch (error) {
    throw new ApiError(500, "Something went wrong while creating the college");
  }
});

const getCollegeRecommendations = asyncHandler(async (req, res) => {
  const collegeRecommendations = await CollegeRecommend.find({}).sort({
    createdAt: -1,
  });
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        collegeRecommendations,
        "College recommendations fetched successfully"
      )
    );
});

export { addCollegeRecommend, getCollegeRecommendations };

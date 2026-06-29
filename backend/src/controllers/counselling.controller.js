import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

import { Counselling } from "../models/counselling.model.js";
import { Otp } from "../models/otp.model.js";

const addCounselling = asyncHandler(async (req, res) => {
  const {
    name,
    contactNumber,
    otp,
    plusTwoCollege,
    interestedDegree,
    address,
  } = req.body;

  if (
    !name ||
    !contactNumber ||
    !plusTwoCollege ||
    !interestedDegree ||
    !address
  ) {
    throw new ApiError(400, "Missing required fields");
  }

  const dbOtp = await Otp.findOne({ identifier: `${contactNumber}`, otp });
  if (!dbOtp) {
    throw new ApiError(400, "Invalid OTP");
  }
  await Otp.deleteMany({ identifier: `${contactNumber}` });

  await Counselling.create({
    name,
    contactNumber,
    plusTwoCollege,
    interestedDegree,
    address,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Counselling request submitted"));
});

const getCounsellings = asyncHandler(async (req, res) => {
  const counsellings = await Counselling.find({}).sort({ createdAt: -1 });
  return res
    .status(200)
    .json(
      new ApiResponse(200, counsellings, "Counsellings fetched successfully")
    );
});

export { addCounselling, getCounsellings };

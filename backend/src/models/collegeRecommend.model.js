import mongoose, { Schema } from "mongoose";

const collegeRecommendSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    contactNumber: { type: Number, required: true },
    fees: { type: String, required: true },
    location: { type: String, required: true },
    rank: { type: String, required: true },
    ktmDistrict: { type: String },
    coursePreference: { type: String },
    desiredCollege: { type: String },
    ktmArea: { type: String },
    reputationRequired: { type: Number, required: true, default: 5 },
    personalVehicle: { type: Boolean, default: false },
    publicTransport: { type: Boolean, default: false },
    nonCredit: { type: Boolean, default: false },
    extracurricular: { type: Boolean, default: false },
    remarks: { type: String },
  },
  { timestamps: true }
);

export const CollegeRecommend = mongoose.model(
  "CollegeRecommend",
  collegeRecommendSchema
);

import mongoose, { Schema } from "mongoose";

const counsellingSchema = new Schema(
  {
    name: { type: String, required: true },
    contactNumber: { type: Number, required: true },
    plusTwoCollege: { type: String, required: true },
    interestedDegree: { type: String, required: true },
    address: { type: String, required: true },
    status: {
      type: String,
      enum: ["unhandled", "positive", "negative"],
      default: "unhandled",
    },
    remarks: { type: String },
  },
  { timestamps: true }
);

export const Counselling = mongoose.model("Counselling", counsellingSchema);

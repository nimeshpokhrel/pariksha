import mongoose, { Schema } from "mongoose";

const valueSchema = new Schema({
  banner100: { type: String, required: true },
  banner200: { type: String, required: true },
  fullPageMobile: { type: String, required: true },
  fullPageDesktop: { type: String, required: true },
  video: { type: String, required: true },
  link: { type: String, required: true },
});

const adSchema = new Schema(
  {
    value: valueSchema,
    probability: { type: Number, required: true },
    location: { type: String, default: "Kathmandu" },
  },
  { timestamps: true }
);

export const Ad = mongoose.model("Ad", adSchema);

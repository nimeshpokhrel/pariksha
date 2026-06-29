import mongoose, { Schema } from "mongoose";

const completedVideoSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    video: { type: Schema.Types.ObjectId, ref: "Video", required: true },
  },
  { timestamps: true }
);

export const CompletedVideo = mongoose.model(
  "CompletedVideo",
  completedVideoSchema
);

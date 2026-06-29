import mongoose, { Schema } from "mongoose";

const sectionSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    videos: [
      {
        type: Schema.Types.ObjectId,
        ref: "Video",
      },
    ],
    videoCount: { type: Number, default: 0 },
    duration: { type: String },
    course: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    subject: {
      type: Schema.Types.ObjectId,
      ref: "Subject",
      required: true,
    },
  },
  { timestamps: true }
);

export const Section = mongoose.model("Section", sectionSchema);

import mongoose, { Schema } from "mongoose";

const subjectSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    link: {
      type: String,
      required: true,
    },
    sections: [
      {
        type: Schema.Types.ObjectId,
        ref: "Section",
      },
    ],
    course: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    videoCount: { type: Number, default: 0 },
    duration: { type: String },
    image: { type: String },
  },
  { timestamps: true }
);

export const Subject = mongoose.model("Subject", subjectSchema);

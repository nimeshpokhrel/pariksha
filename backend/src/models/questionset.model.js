import mongoose, { Schema } from "mongoose";

const questionSetSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    link: {
      type: String,
      required: true,
    },
    number: {
      type: String,
      required: true,
    },
    avgScore: {
      type: Number,
      default: 0,
    },
    highestScore: {
      type: Number,
      default: 0,
    },
    submissionCount: {
      type: Number,
      default: 0,
    },
    setType: { type: String, enum: ["past", "mock"], required: true },
    subjects: [
      {
        type: Schema.Types.ObjectId,
        ref: "QuestionSubject",
      },
    ],
    course: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    description: {
      type: String,
    },
  },
  { timestamps: true }
);

export const QuestionSet = mongoose.model("QuestionSet", questionSetSchema);

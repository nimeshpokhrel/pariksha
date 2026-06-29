import mongoose, { Schema } from "mongoose";

const courseSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    subjects: [
      {
        type: Schema.Types.ObjectId,
        ref: "Subject",
      },
    ],
    questionSets: [
      {
        type: Schema.Types.ObjectId,
        ref: "QuestionSet",
      },
    ],
    description: {
      type: String,
      required: true,
    },
    link: {
      type: String,
      required: true,
    },
    videoCount: { type: Number },
    duration: { type: String },
    image: { type: String },
    entranceExam: {
      type: String,
      required: true,
    },
    entranceExamOpen: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export const Course = mongoose.model("Course", courseSchema);

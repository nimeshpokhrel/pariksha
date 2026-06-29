import mongoose, { Schema } from "mongoose";

const questionSubjectSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    questionSet: {
      type: Schema.Types.ObjectId,
      ref: "QuestionSet",
      required: true,
    },
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
    questions: [
      {
        type: Schema.Types.ObjectId,
        ref: "Question",
      },
    ],
  },
  { timestamps: true }
);

export const QuestionSubject = mongoose.model(
  "QuestionSubject",
  questionSubjectSchema
);

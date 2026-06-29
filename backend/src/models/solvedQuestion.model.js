import mongoose, { Schema } from "mongoose";

const solvedQuestionSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    question: {
      type: Schema.Types.ObjectId,
      ref: "Question",
      required: true,
    },
  },
  { timestamps: true }
);

export const SolvedQuestion = mongoose.model(
  "SolvedQuestion",
  solvedQuestionSchema
);

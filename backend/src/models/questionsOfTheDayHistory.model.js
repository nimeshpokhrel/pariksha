import mongoose, { Schema } from "mongoose";

const questionsOfTheDayHistorySchema = new Schema(
  {
    questionOfTheDay: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "QuestionsOfTheDay",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const QuestionsOfTheDayHistory = mongoose.model(
  "QuestionsOfTheDayHistory",
  questionsOfTheDayHistorySchema
);

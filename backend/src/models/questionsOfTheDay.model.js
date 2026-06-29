import mongoose, { Schema } from "mongoose";

const questionsOfTheDaySchema = new Schema(
  {
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    questions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Question",
      },
    ],
    date: {
      type: Date,
      required: true,
      unique: false,
    },
  },
  {
    timestamps: true,
  }
);

export const QuestionsOfTheDay = mongoose.model(
  "QuestionsOfTheDay",
  questionsOfTheDaySchema
);

import mongoose, { Schema } from "mongoose";

const answerSchema = new Schema({
  type: {
    type: String,
    enum: ["text", "image"],
    default: "text",
  },
  text: { type: String, required: true },
});

const questionSchema = new Schema(
  {
    questionText: {
      type: String,
      required: true,
    },
    image: { type: String },
    hint: { type: String },
    solution: { type: String },
    answers: [answerSchema],
    correctAnswer: {
      type: Schema.Types.ObjectId,
      ref: "Answer",
      required: true,
    },
    topic: {
      type: Schema.Types.ObjectId,
      ref: "Topic",
      required: true,
    },
    course: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    questionSet: {
      type: Schema.Types.ObjectId,
      ref: "QuestionSet",
      required: false,
    },
    questionsOfTheDay: {
      type: Schema.Types.ObjectId,
      ref: "QuestionsOfTheDay",
      required: false,
    },
    questionSubject: {
      type: Schema.Types.ObjectId,
      ref: "QuestionSubject",
      required: false,
    },
    subjectId: {
      type: Schema.Types.ObjectId,
      ref: "Subject",
      required: true,
    },
  },
  { timestamps: true }
);

export const Answer = mongoose.model("Answer", answerSchema);
export const Question = mongoose.model("Question", questionSchema);

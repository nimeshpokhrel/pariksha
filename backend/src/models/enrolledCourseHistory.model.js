import mongoose, { Schema } from "mongoose";

const enrolledCourseHistorySchema = new Schema(
  {
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
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

export const EnrolledCourseHistory = mongoose.model(
  "EnrolledCourseHistory",
  enrolledCourseHistorySchema
);

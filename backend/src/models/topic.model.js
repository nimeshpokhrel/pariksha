import mongoose, { Schema } from "mongoose";
import { Subject } from "./subject.model.js";

const topicSchema = new Schema({
  name: { type: String, required: true },
  subjectId: {
    type: Schema.Types.ObjectId,
    ref: "Subject",
    required: true,
  },
  course: {
    type: Schema.Types.ObjectId,
    ref: "Course",
  },
});

topicSchema.pre("validate", async function (next) {
  if (!this.course && this.subjectId) {
    try {
      const subject = await Subject.findById(this.subjectId);
      if (subject && subject.course) {
        this.course = subject.course;
      } else {
        throw new Error("Course not found for given subject");
      }
    } catch (err) {
      return next(err);
    }
  }
  next();
});

topicSchema.index({ name: 1, subjectId: 1 }, { unique: true });

export const Topic = mongoose.model("Topic", topicSchema);

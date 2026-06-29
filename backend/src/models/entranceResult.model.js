import mongoose from "mongoose";

const entranceResultSchema = new mongoose.Schema(
  {
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    year: { type: Number, required: true },
    resultLink: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

export const EntranceResult = mongoose.model(
  "EntranceResult",
  entranceResultSchema
);

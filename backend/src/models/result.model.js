import mongoose from "mongoose";

const resultSchema = new mongoose.Schema(
  {
    mocktest: {
      type: String,
      required: true,
      unique: true,
    },
    results: [
      {
        symbolNo: {
          type: String,
          required: true,
        },
        score: {
          type: Number,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const Result = mongoose.model("Result", resultSchema);

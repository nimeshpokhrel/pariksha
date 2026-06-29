import mongoose from "mongoose";

const dailyLoginSchema = new mongoose.Schema({
  date: {
    type: String, // "YYYY-MM-DD"
    required: true,
    unique: true,
  },
  count: {
    type: Number,
    default: 0,
  },
  users: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
});

export const DailyLogin = mongoose.model("DailyLogin", dailyLoginSchema);

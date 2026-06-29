import mongoose from "mongoose";

const userLoginSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    date: { type: String, required: true },
    createdAt: { type: Date, default: Date.now, index: { expires: 86400 } },
  },
  { timestamps: false }
);

userLoginSchema.index({ userId: 1, date: 1 }, { unique: true });

export const UserLogin = mongoose.model("UserLogin", userLoginSchema);

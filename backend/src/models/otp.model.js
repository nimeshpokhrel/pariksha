import mongoose, { Schema } from "mongoose";

import { sendOtpHandler } from "../utils/sendOtpHandler.js";

const otpSchema = new Schema({
  identifier: { type: String, required: true, index: true },
  otp: { type: Number, required: true, index: true },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 60 * 5, // The document will be automatically deleted after 5 minutes of its creation time
  },
});

otpSchema.pre("save", async function (next) {
  if (this.isNew) {
    sendOtpHandler({ identifier: this.identifier, otp: this.otp });
  }
  next();
});

export const Otp = mongoose.model("Otp", otpSchema);

import mongoose, { Schema } from "mongoose";

const notificationListSchema = new Schema(
  {
    endpoint: { type: String, required: true },
    expirationTime: { type: Schema.Types.Mixed, default: null },
    keys: { type: Object, required: true },
  },
  { timestamps: true }
);

export const NotificationList = mongoose.model(
  "NotificationList",
  notificationListSchema
);

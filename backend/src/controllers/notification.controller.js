import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";

import { ApiResponse } from "../utils/ApiResponse.js";
import webpush from "web-push";
import { NotificationList } from "../models/notificationList.model.js";

webpush.setVapidDetails(
  "mailto:srijan.timsina.39@gmail.com",
  "BMD63k473VRIuwi6jcvqGoP85fxaMasyo7e848jXrZz0JYifnuG1RelGyq2yWche4u40mvCSjCzBr3XbRzZeXw8",
  "T9vrDIqIKpG1Lxq8whpMtqp42ddFeJ1e1k0VDMHHpNg"
);

const subscribeNotification = asyncHandler(async (req, res) => {
  const subscription = req.body;

  await NotificationList.create({
    endpoint: subscription.endpoint,
    keys: subscription.keys,
  });

  // Store subscription in your database
  // await db.saveSubscription(subscription);

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Notification Subscribed"));
});

const sendNotification = asyncHandler(async (req, res) => {
  const { title, body, icon, badge } = req.body;
  const subscriptions = await NotificationList.find({}).select(
    "endpoint expirationTime keys -_id"
  );

  const payload = JSON.stringify({
    title,
    body,
    icon,
    badge,
  });

  Promise.all(
    subscriptions.map((subscription) => {
      webpush.sendNotification(subscription, "test notification");
    })
  )
    .then(() =>
      res
        .status(200)
        .json(new ApiResponse(200, {}, "Notification sent successfully"))
    )
    .catch((err) => {
      console.error("Error sending notification");
      throw new ApiError(500, "Error sending notification");
    });
});

export { subscribeNotification, sendNotification };

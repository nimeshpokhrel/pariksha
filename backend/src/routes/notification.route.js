import { Router } from "express";
import {
  sendNotification,
  subscribeNotification,
} from "../controllers/notification.controller.js";

const router = Router();

router.route("/subscribe").post(subscribeNotification);
router.route("/sendNotification").post(sendNotification);

export default router;

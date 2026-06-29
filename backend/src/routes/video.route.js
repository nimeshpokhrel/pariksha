import { Router } from "express";
import nocache from "nocache";

import {
  getVideo,
  updateUserWatchedVideos,
  addToWatchHistory,
  getWatchHistory,
  getCompletedVideos,
  getVideoFullData,
} from "../controllers/video.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/getVideo/:videoId").get(getVideo);
router.route("/getVideoFullData/:videoId").get(getVideoFullData);
router
  .route("/updateUserWatchedVideos")
  .post(nocache(), verifyJWT, updateUserWatchedVideos);
router
  .route("/addToWatchHistory")
  .post(nocache(), verifyJWT, addToWatchHistory);
router
  .route("/getWatchHistory/:count")
  .get(nocache(), verifyJWT, getWatchHistory);
router
  .route("/getCompletedVideos")
  .get(nocache(), verifyJWT, getCompletedVideos);

export default router;

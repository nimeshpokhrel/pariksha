import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import nocache from "nocache";

import {
  getSubjectInfo,
  updateUserSubjectVideo,
} from "../controllers/subject.controller.js";

const router = Router();

router.route("/getSubjectInfo/:subjectLink").get(getSubjectInfo);
router
  .route("/updateUserSubjectVideo")
  .post(nocache(), verifyJWT, updateUserSubjectVideo);

export default router;

import { Router } from "express";

import { getUser, verifyJWT } from "../middlewares/auth.middleware.js";
import {
  getAllQuestionSets,
  getQuestionSet,
  submitTestAnswers,
} from "../controllers/questionset.controller.js";
import nocache from "nocache";

const router = Router();

router.route("/getAllQuestionSets").get(getAllQuestionSets);
router
  .route("/getQuestionSetData/:link/:courseLink")
  .get(getUser, getQuestionSet);
router
  .route("/submitTestAnswers/:id")
  .post(nocache(), verifyJWT, submitTestAnswers);

export default router;

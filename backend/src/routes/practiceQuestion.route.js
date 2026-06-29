import { Router } from "express";
import {
  addSolvedQuestion,
  getPracticeQuestions,
} from "../controllers/practiceQuestion.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import nocache from "nocache";

const router = Router();

router
  .route("/addSolvedQuestion/:questionId")
  .post(verifyJWT, addSolvedQuestion);
router
  .route("/getPracticeQuestions")
  .get(nocache(), verifyJWT, getPracticeQuestions);

export default router;

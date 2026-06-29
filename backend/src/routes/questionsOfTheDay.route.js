import { Router } from "express";
import {
  getAllQuestionsOfTheDay,
  getQuestionsOfTheDay,
} from "../controllers/questionsOfTheDay.controller.js";

const router = Router();

router.route("/getAllQuestionsOfTheDay").get(getAllQuestionsOfTheDay);
router.route("/getQuestionsOfTheDayData/:_id").get(getQuestionsOfTheDay);
// router
//   .route("/submitTestAnswers/:id")
//   .post(nocache(), verifyJWT, submitTestAnswers);

export default router;

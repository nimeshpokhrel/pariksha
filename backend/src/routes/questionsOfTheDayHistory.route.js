import { Router } from "express";

import { verifyJWT } from "../middlewares/auth.middleware.js";
import { addToQuestionsOfTheDayHistory } from "../controllers/questionsOfTheDayHistory.controller.js";

const router = Router();

router
  .route("/addToQuestionsOfTheDayHistory/:_id")
  .post(verifyJWT, addToQuestionsOfTheDayHistory);

export default router;

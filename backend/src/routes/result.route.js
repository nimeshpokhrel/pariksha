import { Router } from "express";
import {
  getResult,
  getResultMocktests,
} from "../controllers/result.controller.js";

const router = Router();

router.route("/mocktests").get(getResultMocktests);

router.route("/result").post(getResult);

export default router;
import { Router } from "express";
import {
  addFormSubmission,
  getFormSubmissions,
} from "../controllers/formSubmission.controller.js";
import nocache from "nocache";

const router = Router();

router.route("/getFormSubmissions").get(nocache(), getFormSubmissions);
router.route("/addFormSubmission").post(nocache(), addFormSubmission);

export default router;

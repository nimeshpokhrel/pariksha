import { Router } from "express";
import {
  getAllDegrees,
  getDegreeData,
} from "../controllers/degree.controller.js";

const router = Router();

router.route("/getAllDegrees").get(getAllDegrees);
router.route("/getDegreeData/:link").get(getDegreeData);

export default router;

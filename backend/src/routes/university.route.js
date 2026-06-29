import { Router } from "express";

import {
  getAllUniversities,
  getUniversityData,
} from "../controllers/university.controller.js";

const router = Router();

router.route("/getAllUniversities").get(getAllUniversities);
router.route("/getUniversityData/:link").get(getUniversityData);

export default router;

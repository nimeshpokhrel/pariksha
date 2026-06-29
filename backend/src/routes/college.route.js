import { Router } from "express";
import {
  getAllColleges,
  getCollegeData,
} from "../controllers/college.controller.js";

const router = Router();

router.route("/getAllColleges").get(getAllColleges);
router.route("/getCollegeData/:link").get(getCollegeData);

export default router;

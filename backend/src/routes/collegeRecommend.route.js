import { Router } from "express";

import { addCollegeRecommend } from "../controllers/collegeRecommend.controller.js";

const router = Router();

router.route("/addCollegeRecommend").post(addCollegeRecommend);

export default router;

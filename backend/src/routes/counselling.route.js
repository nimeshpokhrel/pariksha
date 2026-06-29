import { Router } from "express";
import nocache from "nocache";

import { addCounselling } from "../controllers/counselling.controller.js";

const router = Router();

router.route("/addCounselling").post(nocache(), addCounselling);

export default router;

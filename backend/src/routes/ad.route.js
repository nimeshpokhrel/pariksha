import { Router } from "express";
import { getAds } from "../controllers/ad.controller.js";

const router = Router();

router.route("/getAllAds").get(getAds);

export default router;

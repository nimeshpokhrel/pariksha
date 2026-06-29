import { Router } from "express";
import {
  getAllSectors,
  getSectorData,
} from "../controllers/sector.controller.js";

const router = Router();

router.route("/getAllSectors").get(getAllSectors);
router.route("/getSectorData/:link").get(getSectorData);

export default router;

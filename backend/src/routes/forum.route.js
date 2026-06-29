import { Router } from "express";
import {
  createForum,
  getAllForums,
  getForumById,
} from "../controllers/forum.controller.js";

const router = Router();

router.route("/").get(getAllForums).post(createForum);

router.route("/:id").get(getForumById);

export default router;

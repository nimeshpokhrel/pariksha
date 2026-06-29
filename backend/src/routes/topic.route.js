import { Router } from "express";

import { getAllTopics } from "../controllers/topic.controller.js";

const router = Router();

router.route("/getAllTopics").get(getAllTopics);

export default router;

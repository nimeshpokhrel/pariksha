import { Router } from "express";
import { getAllBlogs, getBlogById } from "../controllers/blog.controller.js";

const router = Router();

router.route("/").get(getAllBlogs);

router.route("/:id").get(getBlogById);

export default router;

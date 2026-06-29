import { Router } from "express";
import {
  addEnrolledCourseHistory,
  getAllCourses,
  getCourseData,
  getCourseSubjectsAndTopics,
} from "../controllers/course.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/getAllCourses").get(getAllCourses);
router.route("/getCourseData/:link").get(getCourseData);
router
  .route("/getCourseSubjectsAndTopics/:link")
  .get(getCourseSubjectsAndTopics);
router.route("/enrollCourse/:_id").post(verifyJWT, addEnrolledCourseHistory);

export default router;

import { Router } from "express";
import {
  getCourseData,
  createCourse,
  deleteCourse,
  updateCourse,
} from "../controllers/admin/course.controller.js";
import { verifySuperAdmin } from "../middlewares/auth.middleware.js";
import {
  createSubject,
  deleteSubject,
  getSubject,
  updateSubject,
  updateSubjectsArray,
} from "../controllers/admin/subject.controller.js";

import {
  createSection,
  deleteSection,
  getSection,
  updateSection,
  updateSectionsArray,
} from "../controllers/admin/section.controller.js";
import {
  createVideo,
  deleteVideo,
  updateVideo,
  updateVideosArray,
} from "../controllers/admin/video.controller.js";
import {
  createQuestionSet,
  updateQuestionSetsArray,
  deleteQuestionSet,
  updateQuestionSet,
  getQuestionSet,
} from "../controllers/admin/questionSet.controller.js";
import {
  deleteQuestionSubject,
  getQuestionSubject,
  updateQuestionSubjectsArray,
} from "../controllers/admin/questionSubject.controller.js";
import {
  createQuestion,
  createQuestionOfTheDayQuestion,
  createQuestionTopic,
  deleteQuestion,
  deleteQuestionTopic,
  updateQuestion,
  updateQuestionAnswer,
  updateQuestionsArray,
  updateQuestionsOfTheDayArray,
  updateQuestionTopic,
} from "../controllers/admin/question.controller.js";
import {
  createUniversity,
  deleteUniversity,
  updateUniversity,
} from "../controllers/admin/university.controller.js";
import {
  createSector,
  deleteSector,
  updateSector,
} from "../controllers/admin/sector.controller.js";
import {
  createDegree,
  deleteDegree,
  updateDegree,
} from "../controllers/admin/degree.controller.js";
import {
  createCollege,
  deleteCollege,
  updateCollege,
} from "../controllers/admin/college.controller.js";
import {
  createQuestionsOfTheDay,
  deleteQuestionsOfTheDay,
  getQuestionsOfTheDay,
  updateQuestionsOfTheDay,
} from "../controllers/admin/questionsOfTheDay.js";
import {
  changeUserAdsSettings,
  getAllUsers,
  getUserById,
} from "../controllers/admin/users.controller.js";
import {
  createAd,
  deleteAd,
  updateAd,
} from "../controllers/admin/ad.controller.js";
import { getCounsellings } from "../controllers/counselling.controller.js";
import { getCollegeRecommendations } from "../controllers/collegeRecommend.controller.js";

const router = Router();

//Course Routes
router.route("/getCourseData/:_id").get(getCourseData);
router.route("/createCourse").post(createCourse);
router.route("/deleteCourse/:_id").delete(deleteCourse);
router.route("/updateCourse/:_id").put(updateCourse);

//Subject Routes
router.route("/createSubject").post(createSubject);
router.route("/updateSubjectsArray/:_id").put(updateSubjectsArray);
router.route("/updateSubject/:_id").put(updateSubject);
router
  .route("/deleteSubject/:courseId/:_id")
  .delete(verifySuperAdmin, deleteSubject);
router.route("/getSubject/:_id").get(getSubject);

//Section Routes
router.route("/createSection").post(createSection);
router.route("/updateSectionsArray/:_id").put(updateSectionsArray);
router.route("/updateSection/:_id").put(updateSection);
router
  .route("/deleteSection/:subjectId/:_id")
  .delete(verifySuperAdmin, deleteSection);
router.route("/getSection/:_id").get(getSection);

//Video Routes
router.route("/createVideo").post(createVideo);
router.route("/updateVideosArray/:_id").put(updateVideosArray);
router.route("/updateVideo/:_id").put(updateVideo);
router.route("/deleteVideo/:subjectId/:sectionId/:_id").delete(deleteVideo);

//Question Set Routes
router.route("/getQuestionSet/:_id").get(getQuestionSet);
router.route("/createQuestionSet").post(createQuestionSet);
router.route("/updateQuestionSetsArray/:_id").put(updateQuestionSetsArray);
router.route("/updateQuestionSet/:_id").put(updateQuestionSet);
router.route("/deleteQuestionSet/:courseId/:_id").delete(deleteQuestionSet);

//Questions Of The Day Routes
router.route("/getQuestionsOfTheDayData/:_id").get(getQuestionsOfTheDay);
router.route("/createQuestionsOfTheDay").post(createQuestionsOfTheDay);
router.route("/updateQuestionsOfTheDay/:_id").put(updateQuestionsOfTheDay);
router.route("/deleteQuestionsOfTheDay/:_id").delete(deleteQuestionsOfTheDay);

//Question Subject Routes
router.route("/getQuestionSubject/:_id").get(getQuestionSubject);
router.route("/deleteQuestionSubject/:_id").delete(deleteQuestionSubject);
router
  .route("/updateQuestionSubjectsArray/:_id")
  .put(updateQuestionSubjectsArray);

//Question Routes
router.route("/createQuestion").post(createQuestion);
router
  .route("/createQuestionOfTheDayQuestion")
  .post(createQuestionOfTheDayQuestion);
router.route("/updateQuestionsArray/:_id").put(updateQuestionsArray);
router
  .route("/updateQuestionsOfTheDayArray/:_id")
  .put(updateQuestionsOfTheDayArray);
router.route("/deleteQuestion/:_id").delete(deleteQuestion);
router.route("/updateQuestion/:questionId").put(updateQuestion);
router.route("/updateQuestionAnswer/:questionId").put(updateQuestionAnswer);

//Question Topic Routes
router.route("/createQuestionTopic").post(createQuestionTopic);
router.route("/updateQuestionTopic/:_id").put(updateQuestionTopic);
router.route("/deleteQuestionTopic/:_id").delete(deleteQuestionTopic);

// Landing Pages
// University Routes
router.route("/createUniversity").post(createUniversity);
router.route("/updateUniversity/:_id").put(updateUniversity);
router.route("/deleteUniversity/:_id").delete(deleteUniversity);

// Sector Routes
router.route("/createSector").post(createSector);
router.route("/updateSector/:_id").put(updateSector);
router.route("/deleteSector/:_id").delete(deleteSector);

//Degree Routes
router.route("/createDegree").post(createDegree);
router.route("/updateDegree/:_id").put(updateDegree);
router.route("/deleteDegree/:_id").delete(deleteDegree);

//College Routes
router.route("/createCollege").post(createCollege);
router.route("/updateCollege/:_id").put(updateCollege);
router.route("/deleteCollege/:_id").delete(deleteCollege);

//Users Routes
router.route("/getAllUsers").get(verifySuperAdmin, getAllUsers);
router.route("/getUserById/:id").get(getUserById);
router.route("/changeUserAdsSettings/:_id").put(changeUserAdsSettings);

// AD Routes
router.route("/createAd").post(createAd);
router.route("/updateAd/:_id").put(updateAd);
router.route("/deleteAd/:_id").delete(deleteAd);

// Form Routes
router.route("/getCounsellings").get(getCounsellings);
router.route("/getCollegeRecommendations").get(getCollegeRecommendations);

export default router;

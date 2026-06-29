import AdminJS from "adminjs";
import express from "express";
import AdminJSExpress from "@adminjs/express";
import * as AdminJSMongoose from "@adminjs/mongoose";
import session from "express-session";
import { default as MongoDBSession } from "connect-mongodb-session";
import "../src/config/env.js";
import { DB_NAME } from "../src/constants.js";
import componentLoader from "./ComponentLoader.js";

import { Ad } from "../src/models/ad.model.js";
import { Blog } from "../src/models/blog.model.js";
import { College } from "../src/models/college.model.js";
import { CollegeRecommend } from "../src/models/collegeRecommend.model.js";
import { CompletedVideo } from "../src/models/completedVideo.model.js";
import { Course } from "../src/models/course.model.js";
import { DailyLogin } from "../src/models/dailyLogin.model.js";
import { Degree } from "../src/models/degree.model.js";
import { EnrolledCourseHistory } from "../src/models/enrolledCourseHistory.model.js";
import { FormSubmission } from "../src/models/formSubmissions.model.js";
import { NotificationList } from "../src/models/notificationList.model.js";
import { Otp } from "../src/models/otp.model.js";
import { Answer, Question } from "../src/models/question.model.js";
import { QuestionSet } from "../src/models/questionset.model.js";
import { University } from "../src/models/university.model.js";
import { QuestionsOfTheDay } from "../src/models/questionsOfTheDay.model.js";
import { QuestionsOfTheDayHistory } from "../src/models/questionsOfTheDayHistory.model.js";
import { QuestionSubject } from "../src/models/questionsubject.model.js";
import { Result } from "../src/models/result.model.js";
import { Section } from "../src/models/section.model.js";
import { Sector } from "../src/models/sector.model.js";
import { SolvedQuestion } from "../src/models/solvedQuestion.model.js";
import { Subject } from "../src/models/subject.model.js";
import { SubmittedTests } from "../src/models/submittedtests.model.js";
import { Subscription } from "../src/models/subscription.model.js";
import { Topic } from "../src/models/topic.model.js";
import { User } from "../src/models/user.model.js";
import { UserLogin } from "../src/models/userLogin.model.js";
import { Video } from "../src/models/video.model.js";
import { WatchHistory } from "../src/models/watchHistory.model.js";
import { EntranceResult } from "../src/models/entranceResult.model.js";

const MongoStore = MongoDBSession(session);
const Router = express.Router();

AdminJS.registerAdapter({
  Resource: AdminJSMongoose.Resource,
  Database: AdminJSMongoose.Database,
});

// ===== AUTH FUNCTION =====
const authenticate = async (email, password) => {
  if (email === "admin@pariksha.solutions" && password === "ol-ds)0Z6[B8") {
    return { email, role: "superadmin" };
  } else if (
    email === "editor@pariksha.solutions" &&
    password === "w~1;?00[J43Hsh1d"
  ) {
    return { email, role: "editor" };
  }
  return null;
};

// ===== ACTION PERMISSION HELPERS =====
const canEdit = ({ currentAdmin }) =>
  currentAdmin?.role === "superadmin" || currentAdmin?.role === "editor";
const canDelete = ({ currentAdmin }) => currentAdmin?.role === "superadmin";
const canCreate = ({ currentAdmin }) =>
  currentAdmin?.role === "superadmin" || currentAdmin?.role === "editor";
const canList = () => true;
const canShow = () => true;
const canSearch = () => true;

// ===== COMMON ACTIONS SETUP =====
const roleBasedActions = {
  list: { isAccessible: canList },
  show: { isAccessible: canShow },
  edit: { isAccessible: canEdit },
  delete: { isAccessible: canDelete },
  new: { isAccessible: canCreate },
  search: { isAccessible: canSearch },
  bulkDelete: { isAccessible: canDelete },
};

// ===== RESOURCE WRAPPER =====
const wrapResource = (model, customOptions = {}) => ({
  resource: model,
  options: {
    actions: roleBasedActions,
    ...customOptions,
  },
});

// ===== RESOURCES =====
const resources = [
  wrapResource(Ad),
  wrapResource(Blog, {
    properties: {
      content: {
        type: "richtext",
      },
    },
  }),
  wrapResource(College),
  wrapResource(CollegeRecommend),
  wrapResource(CompletedVideo),
  wrapResource(Course),
  wrapResource(DailyLogin),
  wrapResource(Degree),
  wrapResource(EnrolledCourseHistory),
  wrapResource(FormSubmission),
  wrapResource(NotificationList),
  wrapResource(Otp),
  wrapResource(Question),
  wrapResource(Answer),
  wrapResource(QuestionSet),
  wrapResource(QuestionsOfTheDay),
  wrapResource(QuestionsOfTheDayHistory),
  wrapResource(QuestionSubject),
  wrapResource(Result),
  wrapResource(Section),
  wrapResource(Sector),
  wrapResource(SolvedQuestion),
  wrapResource(Subject),
  wrapResource(SubmittedTests),
  wrapResource(Subscription),
  wrapResource(Topic),
  wrapResource(University),
  wrapResource(User),
  wrapResource(UserLogin),
  wrapResource(Video),
  wrapResource(WatchHistory),
  wrapResource(EntranceResult),
  // wrapResource(question_model, {
  //   properties: {
  //     hint: {
  //       type: "textarea",
  //       props: {
  //         rows: 8,
  //       },
  //     },
  //   },
  // }),
  // wrapResource(model_set_model),
  // wrapResource(old_question_set_model),
  // wrapResource(blog_model, {
  //   properties: {
  //     content: {
  //       type: "richtext",
  //     },
  //   },
  // }),
  // wrapResource(result_model),
];

// ===== START ADMIN PANEL =====
const startAdminPanel = async () => {
  try {
    const admin = new AdminJS({
      rootPath: "/admin",
      componentLoader,
      resources,
      branding: {
        companyName: "Pariksha Admin",
      },
    });

    const sessionStore = new MongoStore(
      {
        uri: process.env.MONGODB_URI,
        databaseName: process.env.MONGODB_DBNAME || DB_NAME,
        collection: "sessions",
      },
      // Passing this connect callback makes connect-mongodb-session route
      // connection errors HERE instead of throwing them as an uncaught
      // exception. The 'error' listener alone was NOT enough — the library
      // still threw from its async connect path and crashed the whole process.
      (error) => {
        if (error) {
          console.error(
            "AdminJS session store could not connect:",
            error.message
          );
        }
      }
    );

    // Also handle runtime errors emitted after the initial connect.
    sessionStore.on("error", (error) => {
      console.error("AdminJS session store error:", error.message);
    });

    const adminRouter = AdminJSExpress.buildAuthenticatedRouter(
      admin,
      {
        authenticate,
        cookieName: "adminjs",
        cookiePassword: "sessionsecret",
      },
      null,
      {
        store: sessionStore,
        resave: false,
        saveUninitialized: false,
        secret: "sessionsecret",
        cookie: {
          httpOnly: true,
          secure: false,
        },
        name: "adminjs",
      }
    );

    Router.use(admin.options.rootPath, adminRouter);
  } catch (error) {
    console.error("Error starting AdminJS:", error);
  }
};

startAdminPanel();

export { Router as admin_router };

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import nocache from "nocache";
import { verifyAdmin, verifyJWT } from "./middlewares/auth.middleware.js";
import userRouter from "./routes/user.route.js";
import courseRouter from "./routes/course.route.js";
import subjectRouter from "./routes/subject.route.js";
import resultRouter from "./routes/result.route.js";
import blogRouter from "./routes/blog.route.js";
import sectionRouter from "./routes/section.route.js";
import videoRouter from "./routes/video.route.js";
import forumRouter from "./routes/forum.route.js";
import questionSetRouter from "./routes/questionset.route.js";
import questionsOfTheDayRouter from "./routes/questionsOfTheDay.route.js";
import questionsOfTheDayHistoryRouter from "./routes/questionsOfTheDayHistory.route.js";
import practiceQuestionRouter from "./routes/practiceQuestion.route.js";
import topicRouter from "./routes/topic.route.js";
import formSubmissionRouter from "./routes/formSubmission.route.js";
import notificationRouter from "./routes/notification.route.js";
import adRouter from "./routes/ad.route.js";
import collegeRecommendRouter from "./routes/collegeRecommend.route.js";
import counsellingRouter from "./routes/counselling.route.js";
import adminRouter from "./routes/admin.route.js";
import universityRouter from "./routes/university.route.js";
import sectorRouter from "./routes/sector.route.js";
import degreeRouter from "./routes/degree.route.js";
import collegeRouter from "./routes/college.route.js";
import { ApiResponse } from "./utils/ApiResponse.js";
import { admin_router } from "../admin/Admin.js";

const app = express();
// const allowedOrigins = process.env.CORS_ORIGIN;
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3465",
  "https://app.pariksha.solutions",
  "https://pariksha.solutions",
  "https://backend.pariksha.solutions",
];

const corsOptions = {
  origin: function (origin, callback) {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      console.log(origin);
      callback(new Error("Not allowed by CORS"));
    }
  },
  optionsSuccessStatus: 200,
  credentials: true,
};

app.use(cors(corsOptions));
app.use(admin_router);

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(express.static("public"));
app.use(cookieParser());

app.use("/api/v2/users", nocache(), userRouter);
app.use("/api/v2/course", courseRouter);
app.use("/api/v2/subject", subjectRouter);
app.use("/api/v2/result", resultRouter);
app.use("/api/v2/blog", blogRouter);
app.use("/api/v2/section", sectionRouter);
app.use("/api/v2/video", videoRouter);
app.use("/api/v2/forum", forumRouter);
app.use("/api/v2/questionset", questionSetRouter);
app.use("/api/v2/questionsOfTheDay", questionsOfTheDayRouter);
app.use("/api/v2/questionOfTheDayHistory", questionsOfTheDayHistoryRouter);
app.use("/api/v2/practiceQuestion", practiceQuestionRouter);
app.use("/api/v2/topic", topicRouter);
app.use("/api/v2/formSubmission", formSubmissionRouter);
app.use("/api/v2/notification", notificationRouter);
app.use("/api/v2/ad", nocache(), adRouter);
app.use("/api/v2/collegeRecommend", collegeRecommendRouter);
app.use("/api/v2/counselling", counsellingRouter);
app.use("/api/v2/admin", verifyJWT, verifyAdmin, adminRouter);

// Landing Pages
app.use("/api/v2/university", universityRouter);
app.use("/api/v2/sector", sectorRouter);
app.use("/api/v2/degree", degreeRouter);
app.use("/api/v2/college", collegeRouter);

//Error Handler
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(statusCode).json(new ApiResponse(statusCode, null, message));
});

export { app };

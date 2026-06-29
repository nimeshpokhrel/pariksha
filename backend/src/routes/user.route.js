import { Router } from "express";
import {
  registerUser,
  checkUserExists,
  loginUser,
  logoutUser,
  refreshAccessToken,
  changeCurrentPassword,
  updateFullName,
  getUserWatchHistory,
  getCurrentUser,
  sendOtp,
  getUserDetails,
  verifyUserOtp,
  resetPassword,
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT, verifyOtp } from "../middlewares/auth.middleware.js";

const router = Router();

// router.route("/register").post(
//   upload.fields([
//     {
//       name: "avatar",
//       maxCount: 1,
//     },
//     {
//       name: "coverImage",
//       maxCount: 1,
//     },
//   ]),
//   registerUser
// );
router.route("/register").post(verifyOtp, registerUser);
router.route("/check").post(checkUserExists);
router.route("/details").post(getUserDetails);
router.route("/login").post(loginUser);

//secured routes
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/refresh-token").post(refreshAccessToken);
router.route("/current-user").get(verifyJWT, getCurrentUser);
router.route("/reset-password").patch(verifyOtp, resetPassword);
router.route("/change-password").patch(verifyJWT, changeCurrentPassword);
router.route("/update-fullName").patch(verifyJWT, updateFullName);

router.route("/watch-history").get(verifyJWT, getUserWatchHistory);

router.route("/sendOtp").post(sendOtp);
router.route("/verifyOtp").post(verifyOtp, verifyUserOtp);

export default router;

// src/utils/trackUserLogin.js
import { User } from "../models/user.model.js";
import { DailyLogin } from "../models/dailyLogin.model.js";
import { UserLogin } from "../models/userLogin.model.js";

const addUserLogin = async (userId) => {
  const today = new Date().toISOString().split("T")[0]; // "YYYY-MM-DD"

  // Check if already logged in today
  const alreadyLoggedIn = await UserLogin.findOne({ userId, date: today });
  if (alreadyLoggedIn) return; // Exit early if already logged in

  // Step 1: Add login event
  await UserLogin.create({ userId, date: today });

  // Step 2: Update daily login count and user list
  await DailyLogin.updateOne(
    { date: today },
    {
      $inc: { count: 1 },
      $addToSet: { users: userId },
    },
    { upsert: true }
  );

  // Step 3: Update user's login history
  await User.findByIdAndUpdate(userId, {
    $addToSet: { loginHistory: today },
  });
};

export { addUserLogin };

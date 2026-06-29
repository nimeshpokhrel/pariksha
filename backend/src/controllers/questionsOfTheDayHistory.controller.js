import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { QuestionsOfTheDayHistory } from "../models/questionsOfTheDayHistory.model.js";

const addToQuestionsOfTheDayHistory = asyncHandler(async (req, res) => {
  const { _id } = req.params;

  const questionsOfTheDayHistory = await QuestionsOfTheDayHistory.findOne({
    questionOfTheDay: _id,
    user: req.user._id,
  });

  if (questionsOfTheDayHistory) {
    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Questions of the day history added."));
  }

  await QuestionsOfTheDayHistory.create({
    questionOfTheDay: _id,
    user: req.user._id,
  });
  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Questions of the day history added."));
});

export { addToQuestionsOfTheDayHistory };

import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { QuestionsOfTheDay } from "../models/questionsOfTheDay.model.js";

const getAllQuestionsOfTheDay = asyncHandler(async (req, res) => {
  const questionsOfTheDay = await QuestionsOfTheDay.find({});

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        questionsOfTheDay,
        "Questions of the day fetched successfully."
      )
    );
});

const getQuestionsOfTheDay = asyncHandler(async (req, res) => {
  const { _id } = req.params;

  const questionsOfTheDay = await QuestionsOfTheDay.findById({
    _id,
  }).populate([
    {
      path: "questions",
      populate: [
        {
          path: "subjectId",
          select: "title",
        },
        { path: "topic", select: "name" },
      ],
    },
    {
      path: "course",
      select: "title",
    },
  ]);

  if (!questionsOfTheDay) {
    throw new ApiError(404, "Questions of the day not found.");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        questionsOfTheDay,
        "Questions of the day fetched successfully."
      )
    );
});

export { getAllQuestionsOfTheDay, getQuestionsOfTheDay };

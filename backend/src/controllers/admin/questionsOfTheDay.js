import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { QuestionsOfTheDay } from "../../models/questionsOfTheDay.model.js";
import { Question } from "../../models/question.model.js";

function convertToUTCDate(dateStr) {
  const date = new Date(dateStr);
  return new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
  );
}

const getQuestionsOfTheDay = asyncHandler(async (req, res) => {
  const { _id } = req.params;

  const questionsOfTheDay = await QuestionsOfTheDay.findOne({
    _id,
  }).populate({
    path: "questions",
  });

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

const createQuestionsOfTheDay = asyncHandler(async (req, res) => {
  const { date, course } = req.body;

  const questionsOfTheDay = await QuestionsOfTheDay.create({
    date: convertToUTCDate(date),
    course,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, questionsOfTheDay, "Question set Created."));
});

const updateQuestionsOfTheDay = asyncHandler(async (req, res) => {
  const { _id } = req.params;
  const { date } = req.body;

  const questionsOfTheDay = await QuestionsOfTheDay.findByIdAndUpdate(
    _id,
    { date: convertToUTCDate(date) },
    { new: true }
  );

  return res
    .status(200)
    .json(new ApiResponse(200, questionsOfTheDay, "Question set updated"));
});

const deleteQuestionsOfTheDay = asyncHandler(async (req, res) => {
  const { _id } = req.params;

  const questionsOfTheDay = await QuestionsOfTheDay.findById(_id);

  if (!questionsOfTheDay) {
    throw new ApiError(404, "Question set not found");
  }
  await Question.deleteMany({ questionsOfTheDay: questionsOfTheDay._id });
  await QuestionsOfTheDay.deleteOne({ _id: questionsOfTheDay._id });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Question set deleted successfully"));
});

export {
  getQuestionsOfTheDay,
  createQuestionsOfTheDay,
  deleteQuestionsOfTheDay,
  updateQuestionsOfTheDay,
};

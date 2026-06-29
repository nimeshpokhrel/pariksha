import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { QuestionSubject } from "../../models/questionsubject.model.js";
import { Question } from "../../models/question.model.js";
import { Answer } from "../../models/question.model.js";
import { Subject } from "../../models/subject.model.js";
import { Topic } from "../../models/topic.model.js";
import { ShuffleArray } from "../../utils/ShuffleArray.js";
import convertToMongoId from "../../utils/convertToMongoId.js";
import { QuestionsOfTheDay } from "../../models/questionsOfTheDay.model.js";

const createQuestion = asyncHandler(async (req, res) => {
  const {
    questionText,
    questionImage,
    answers,
    questionSubjectId,
    subjectId,
    hint,
    solution,
    topic,
  } = req.body;

  if (
    [questionText, questionSubjectId, subjectId, topic].some(
      (field) => field?.trim() === ""
    )
  ) {
    throw new ApiError(400, "All fields are required.");
  }

  if (!answers || answers.length === 0) {
    throw new ApiError(400, "Answers are required.");
  }

  const answersArray = await Promise.all(
    answers.map(async (answer) => {
      const createdAnswer = await Answer.create({
        text: answer.text,
        type: answer.type,
      });
      return createdAnswer;
    })
  );
  const correctAnswer = answersArray[0]["_id"];
  const shuffledAnswers = await ShuffleArray(answersArray);

  const questionSubject = await QuestionSubject.findById(questionSubjectId);
  const subject = await Subject.findById(subjectId);

  const createdQuestion = await Question.create({
    questionText,
    image: questionImage,
    hint,
    solution,
    answers: shuffledAnswers,
    correctAnswer: correctAnswer,
    topic,
    questionSubject: questionSubject._id,
    subjectId: subject._id,
    course: questionSubject.course,
    questionSet: questionSubject.questionSet,
  });

  await QuestionSubject.findByIdAndUpdate(
    questionSubjectId,
    {
      $push: { questions: createdQuestion._id },
    },
    { new: true }
  );

  return res
    .status(200)
    .json(new ApiResponse(200, createdQuestion, "Question Created."));
});

const createQuestionOfTheDayQuestion = asyncHandler(async (req, res) => {
  const {
    questionText,
    questionImage,
    answers,
    subject,
    hint,
    solution,
    topic,
    questionsOfTheDay,
  } = req.body;

  if (
    [questionText, subject, topic, questionsOfTheDay].some(
      (field) => field?.trim() === ""
    )
  ) {
    throw new ApiError(400, "All fields are required.");
  }

  if (!answers || answers.length === 0) {
    throw new ApiError(400, "Answers are required.");
  }

  const answersArray = await Promise.all(
    answers.map(async (answer) => {
      const createdAnswer = await Answer.create({
        text: answer.text,
        type: answer.type,
      });
      return createdAnswer;
    })
  );
  const correctAnswer = answersArray[0]["_id"];
  const shuffledAnswers = await ShuffleArray([...answersArray]);

  const subjectObj = await Subject.findById(subject);

  const createdQuestion = await Question.create({
    questionText: questionText,
    image: questionImage,
    hint: hint,
    solution: solution,
    answers: shuffledAnswers,
    correctAnswer: correctAnswer,
    topic,
    subjectId: subjectObj._id,
    course: subjectObj.course,
    questionsOfTheDay,
  });

  await QuestionsOfTheDay.findByIdAndUpdate(
    questionsOfTheDay,
    {
      $push: { questions: createdQuestion._id },
    },
    { new: true }
  );

  return res
    .status(200)
    .json(new ApiResponse(200, createdQuestion, "Question Created."));
});

const updateQuestionsArray = asyncHandler(async (req, res) => {
  const { _id } = req.params;

  const newArray = req.body;

  const convertedArray = newArray.map((id) => {
    return convertToMongoId(id);
  });

  const questionSubject = await QuestionSubject.findById(_id);
  if (!questionSubject) {
    throw new ApiError(404, "Course not found");
  }
  if (newArray.length === 0) {
    throw new ApiError(400, "Something Went Wrong");
  }

  await QuestionSubject.findByIdAndUpdate(_id, {
    questions: convertedArray,
  });

  return res.status(200).json(new ApiResponse(200, {}, "Question set updated"));
});

const updateQuestionsOfTheDayArray = asyncHandler(async (req, res) => {
  const { _id } = req.params;

  const newArray = req.body;

  const convertedArray = newArray.map((id) => {
    return convertToMongoId(id);
  });

  const questionsOfTheDay = await QuestionsOfTheDay.findById(_id);
  if (!questionsOfTheDay) {
    throw new ApiError(404, "Questions of the day not found");
  }
  if (newArray.length === 0) {
    throw new ApiError(400, "Something Went Wrong");
  }

  await QuestionsOfTheDay.findByIdAndUpdate(_id, {
    questions: convertedArray,
  });

  return res.status(200).json(new ApiResponse(200, {}, "Question set updated"));
});

const deleteQuestion = asyncHandler(async (req, res) => {
  const { _id } = req.params;

  const question = await Question.findById(_id);
  if (!question) {
    throw new ApiError(404, "Question not found");
  }
  await Question.findByIdAndDelete(_id);
  if (question.questionsOfTheDay) {
    await QuestionsOfTheDay.findByIdAndUpdate(question.questionsOfTheDay, {
      $pull: { questions: _id },
    });
  }
  if (question.questionSubject) {
    await QuestionSubject.findByIdAndUpdate(question.questionSubject, {
      $pull: { questions: _id },
    });
  }

  return res.status(200).json(new ApiResponse(200, {}, "Question deleted"));
});

const updateQuestion = asyncHandler(async (req, res) => {
  const { questionId } = req.params;
  const { questionText, questionImage, hint, solution, topic } = req.body;

  const updatedQuestion = await Question.findByIdAndUpdate(questionId, {
    questionText,
    image: questionImage,
    hint,
    solution,
    topic,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, updatedQuestion, "Question updated"));
});

const updateQuestionAnswer = asyncHandler(async (req, res) => {
  const { questionId } = req.params;
  const { text, type, _id } = req.body;

  const updatedQuestion = await Question.updateOne(
    { _id: questionId, "answers._id": _id },
    {
      $set: {
        "answers.$.text": text,
        "answers.$.type": type,
      },
    }
  );

  return res
    .status(200)
    .json(new ApiResponse(200, updatedQuestion, "Answer updated"));
});

// Topic Controller
const createQuestionTopic = asyncHandler(async (req, res) => {
  const { name, subjectId } = req.body;

  if ([name, subjectId].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "All fields are required.");
  }

  const sameTopic = await Topic.findOne({ name, subjectId });
  if (sameTopic) {
    throw new ApiError(400, "Topic already exists.");
  }

  const createdTopic = await Topic.create({
    name: name.trim(),
    subjectId,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, createdTopic, "Topic Created."));
});

const updateQuestionTopic = asyncHandler(async (req, res) => {
  const { _id } = req.params;
  const { name } = req.body;

  const updatedTopic = await Topic.findByIdAndUpdate(_id, {
    name: name.trim(),
  });

  return res
    .status(200)
    .json(new ApiResponse(200, updatedTopic, "Topic Updated."));
});

const deleteQuestionTopic = asyncHandler(async (req, res) => {
  const { _id } = req.params;

  const topic = await Topic.findById(_id);

  const topicUsed = await Question.find({ topic: _id });
  if (topicUsed.length > 0) {
    throw new ApiError(400, "Topic is used in questions.");
  }

  await QuestionSubject.findByIdAndUpdate(topic.questionSubject, {
    $pull: { topics: _id },
  });

  await Topic.findByIdAndDelete(_id);

  return res.status(200).json(new ApiResponse(200, {}, "Topic Deleted."));
});

export {
  createQuestion,
  updateQuestionsArray,
  updateQuestionsOfTheDayArray,
  deleteQuestion,
  updateQuestion,
  updateQuestionAnswer,
  createQuestionTopic,
  updateQuestionTopic,
  deleteQuestionTopic,
  createQuestionOfTheDayQuestion,
};

import { ApiError } from "../utils/ApiError.js";

import { Course } from "../models/course.model.js";
import { Section } from "../models/section.model.js";
import { Subject } from "../models/subject.model.js";
import { Video } from "../models/video.model.js";
import { QuestionSet } from "../models/questionset.model.js";
import { Question } from "../models/question.model.js";
import { QuestionSubject } from "../models/questionsubject.model.js";
import { SubmittedTests } from "../models/submittedtests.model.js";
import { WatchHistory } from "../models/watchHistory.model.js";
import { CompletedVideo } from "../models/completedVideo.model.js";

//Video Delete Function
const deleteVideoFunc = async (videoId) => {
  await WatchHistory.deleteMany({ video: videoId });
  await CompletedVideo.deleteMany({ video: videoId });
  await Video.deleteOne({ _id: videoId });
  return;
};

//Section Delete Function
const deleteSectionFunc = async (sectionId) => {
  const section = await Section.findById(sectionId);
  section.videos.forEach(async (video) => {
    await deleteVideoFunc(video._id);
  });
  await Section.deleteOne({ _id: sectionId });
  return;
};

//Question Delete Function
const deleteQuestionFunc = async (questionId) => {
  await Question.deleteOne({ _id: questionId });
  return;
};

//QuestionSubject Delete Function
const deleteQuestionSubjectFunc = async (questionSubjectId) => {
  const questionSubject = await QuestionSubject.findById(questionSubjectId);
  questionSubject.questions.forEach(async (question) => {
    await deleteQuestionFunc(question);
  });
  await QuestionSubject.deleteOne({ _id: questionSubjectId });
  return;
};

//Question Set Delete Function
const deleteQuestionSetFunc = async (questionSetId) => {
  const questionSet = await QuestionSet.findById(questionSetId);
  if (!questionSet) {
    throw new ApiError(404, "Question Set not found");
  }
  questionSet.subjects.forEach(async (questionSubject) => {
    await deleteQuestionSubjectFunc(questionSubject);
  });

  await SubmittedTests.deleteMany({ questionSetId: questionSetId });

  await QuestionSet.deleteOne({ _id: questionSetId });
  return;
};

//Subject Delete Function
const deleteSubjectFunc = async (subjectId) => {
  const subject = await Subject.findById(subjectId);
  subject.sections.forEach(async (section) => {
    await deleteSectionFunc(section._id);
  });
  const questionSubjects = await QuestionSubject.find({ subject: subjectId });
  questionSubjects.forEach(async (questionSubject) => {
    await deleteQuestionSubjectFunc(questionSubject._id);
    await QuestionSet.updateMany(
      { subjects: questionSubject._id },
      { $pull: { subjects: questionSubject._id } }
    );
    await QuestionSubject.deleteOne({ _id: questionSubject._id });
  });
  await Subject.deleteOne({ _id: subjectId });
  return;
};

//Course Delete Function
const deleteCourseFunc = async (courseId) => {
  const course = await Course.findById(courseId);
  if (!course) {
    throw new ApiError(404, "Course not found");
  }
  course.subjects.forEach(async (subject) => {
    await deleteSubjectFunc(subject._id);
  });
  course.questionSets.forEach(async (questionSet) => {
    await deleteQuestionSetFunc(questionSet._id);
  });
  await Course.deleteOne({ _id: courseId });
  return;
};

export {
  deleteVideoFunc,
  deleteSectionFunc,
  deleteQuestionSubjectFunc,
  deleteQuestionSetFunc,
  deleteSubjectFunc,
  deleteCourseFunc,
};

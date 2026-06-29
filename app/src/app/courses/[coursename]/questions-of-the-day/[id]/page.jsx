"use client";

import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Spinner from "@/utils/Spinner";
import BannerAd from "@/components/BannerAd";
import { getQuestionsOfTheDayData } from "@/hooks/questionsOfTheDay";
import QuestionOfTheDayQuestions from "@/components/QuestionOfTheDayQuestions";
import { getCourseData } from "@/hooks/courses";
import QuestionsOfTheDayCalendar from "@/components/QuestionsOfTheDayCalendar";
import { useAuth } from "@/utils/AuthContext";
import { LoginModal } from "@/components/LoginModal/LoginModal";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

function Page({ params }) {
  const testId = params.id;
  const link = params.coursename;
  const [subjects, setSubjects] = useState([]);
  const [completed, setCompleted] = useState(false);
  const {
    user,
    userPending,
    addToQuestionsOfTheDayHistory,
    addToEnrolledCourses,
  } = useAuth();

  const { data: testData, isPending } = useQuery({
    queryKey: ["questionsOfTheDay", testId],
    queryFn: () => getQuestionsOfTheDayData(testId),
  });

  const { data: courseData } = useQuery({
    queryKey: ["course-details", link],
    queryFn: (context) => {
      const [, link] = context.queryKey;
      return getCourseData(link);
    },
  });

  useEffect(() => {
    if (testData) {
      let subsdata = testData.questions.map((q) => {
        return { name: q.subjectId.title, questions: [{ ...q }] };
      });
      setSubjects(subsdata);
    }
  }, [testData]);

  useEffect(() => {
    if (user && testData) {
      addToEnrolledCourses(testData?.course?._id);
    }
  }, [user, testData]);

  return (
    <div>
      {isPending && <Spinner />}
      {!user && !userPending && (
        <div className="fixed inset-0 z-[20] flex flex-col items-center justify-center bg-black/50 p-6 text-center backdrop-blur-sm">
          <div className="w-full max-w-md rounded-xl border border-white/20 bg-white/10 p-8 shadow-2xl backdrop-blur-md">
            <h3 className="mb-2 text-2xl font-bold text-white">
              Login Required
            </h3>
            <p className="mb-6 text-white/80">
              Please log in to solve this question set.
            </p>
            <LoginModal
              redirect={`/courses/${link}/questions-of-the-day/${testId}`}
            />
          </div>
        </div>
      )}
      {testData && subjects && subjects.length > 0 && (
        <div>
          <div className="my-6 flex w-full flex-col items-center">
            <BannerAd />
          </div>
          <div className="content-container m-auto w-full border-t-2">
            <div className="mx-auto max-w-4xl">
              <Link
                href={`/courses/${link}`}
                className="mb-0 mt-4 inline-flex items-center text-slate-600 hover:text-slate-900"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Course
              </Link>
            </div>
            <QuestionOfTheDayQuestions
              subjects={subjects}
              courseTitle={testData.course.title}
              completedQuestionSet={() => {
                addToQuestionsOfTheDayHistory(testId);
                setCompleted(true);
              }}
            />
          </div>
          {completed && courseData && (
            <div className="content-container mt-10 max-w-3xl border-t-2 pt-6">
              <h1 className="mb-4 text-center text-2xl font-bold">
                Questions of the Day
              </h1>
              <QuestionsOfTheDayCalendar
                courseLink={courseData.link}
                questionSets={courseData.questionsOfTheDay}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Page;

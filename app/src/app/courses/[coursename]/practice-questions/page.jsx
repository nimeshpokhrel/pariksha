"use client";

import React, { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getPracticeQuestions } from "@/hooks/practiceQuestion";
import { useSearchParams } from "next/navigation";
import PracticeQuestions from "@/components/PracticeQuestions";
import { useAuth } from "@/utils/AuthContext";
import { LoginModal } from "@/components/LoginModal/LoginModal";
import BannerAd from "@/components/BannerAd";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import PracticeQuestionPageSelector from "@/components/PracticeQuestionsSelector/PracticeQuestionPageSelector";
import { getCourseSubjectsAndTopics } from "@/hooks/courses";
import Spinner from "@/utils/Spinner";

export default function Page({ params }) {
  const { user, userPending, addToEnrolledCourses } = useAuth();
  const searchParams = useSearchParams();
  const subject = searchParams.get("subject") || null;
  const course = searchParams.get("course") || null;
  const topic = searchParams.get("topic") || null;
  const unsolved = searchParams.get("unsolved") || false;
  const queryClient = useQueryClient();

  const { data: courseSubjectsAndTopics } = useQuery({
    queryKey: ["courseSubjectsAndTopics", params.coursename],
    queryFn: () => getCourseSubjectsAndTopics(params.coursename),
  });

  const { data: practiceQuestions, isPending } = useQuery({
    queryKey: ["practiceQuestions", subject, course, topic, unsolved],
    queryFn: getPracticeQuestions,
    keepPreviousData: true,
  });

  useEffect(() => {
    if (user && courseSubjectsAndTopics) {
      addToEnrolledCourses(courseSubjectsAndTopics?.course?._id);
    }
  }, [user, courseSubjectsAndTopics]);

  return (
    <div>
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
              redirect={`/courses/${params.coursename}/practice-questions?course=${course}&subject=${subject}&topic=${topic}&unsolved=${unsolved}`}
            />
          </div>
        </div>
      )}
      {user && isPending && <Spinner />}
      {user && practiceQuestions && (
        <>
          <div className="content-container m-auto w-full border-b-2">
            <Link
              href={`/courses/${params.coursename}`}
              className="mb-0 mt-4 inline-flex items-center text-slate-600 hover:text-slate-900"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Course
            </Link>
            <PracticeQuestionPageSelector
              courseLink={params.coursename}
              courseId={courseSubjectsAndTopics?.course?._id}
              subjects={courseSubjectsAndTopics?.subjects}
              topics={courseSubjectsAndTopics?.topics}
            />
          </div>
          <div className="content-container flex w-full flex-col items-center">
            <BannerAd className={"border-b-2 py-3"} />
          </div>

          <PracticeQuestions
            questions={practiceQuestions}
            courseTitle={courseSubjectsAndTopics?.course?.title}
            subjects={courseSubjectsAndTopics?.subjects || []}
            topics={courseSubjectsAndTopics?.topics || []}
            allQuestionsSolved={() =>
              queryClient.invalidateQueries([
                "practiceQuestions",
                subject,
                course,
                topic,
                unsolved,
              ])
            }
          />
          <div className="content-container flex w-full flex-col items-center border-t-2 py-3">
            <BannerAd />
          </div>
        </>
      )}
    </div>
  );
}

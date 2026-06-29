"use client";

import {
  Award,
  Book,
  BookOpen,
  FileQuestion,
  FileText,
  Video,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import HtmlContent from "@/utils/HtmlContent";
import { Button } from "./ui/button";
import Link from "next/link";
import { useAuth } from "@/utils/AuthContext";
import { Progress } from "./ui/progress";
import UploadThingImage from "./UploadThingImage";

export default function CourseCard({ course }) {
  const { testScores, userCompletedVideos, enrolledCourses, user } = useAuth();

  function getCourseVideoIds(courseData) {
    const ids = new Set();
    if (!courseData?.subjects?.length) return ids;

    for (const subject of courseData.subjects) {
      for (const section of subject.sections || []) {
        for (const video of section.videos || []) {
          ids.add(video._id);
        }
      }
    }

    return ids;
  }

  function getWatchedVideosCount(courseVideoIds, userCompletedVideos) {
    return userCompletedVideos.filter((videoId) => courseVideoIds.has(videoId))
      .length;
  }

  function getSubmittedTestsCount(courseData, testScores) {
    if (!courseData?.questionSets?.length || !testScores) return 0;

    let count = 0;
    for (let i = 0; i < courseData.questionSets.length; i++) {
      if (Object.hasOwn(testScores, courseData.questionSets[i])) {
        count++;
      }
    }

    return count;
  }

  const courseVideoIds = getCourseVideoIds(course);

  const watchedCount = getWatchedVideosCount(
    courseVideoIds,
    userCompletedVideos
  );

  const submittedTestsCount = getSubmittedTestsCount(course, testScores);

  const progress = Math.round(
    ((submittedTestsCount * 2 + watchedCount) /
      (course?.questionSets?.length * 2 + course?.videoCount)) *
      100
  );

  return (
    <>
      <Link href={`/courses/${course.link}`} className="h-full">
        <Card
          className={`group flex h-full transform flex-col overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm transition-all duration-500 hover:shadow-lg lg:flex-row lg:rounded-b-none`}
        >
          <div
            className={`relative aspect-[1.91/1] max-h-[470px] w-full bg-white lg:h-auto lg:w-2/5`}
          >
            <UploadThingImage
              src={course.image}
              alt={course.title}
              fill
              className="object-contain"
            />
            {user && enrolledCourses.includes(course._id) && (
              <Progress
                value={progress || 0}
                className="absolute bottom-0 left-0 right-0 z-10 rounded-none lg:hidden"
              />
            )}
          </div>
          {user && enrolledCourses.includes(course._id) && (
            <Progress
              value={progress || 0}
              className="absolute bottom-0 left-0 right-0 z-10 hidden rounded-none lg:block"
            />
          )}

          <CardContent className="flex-1 p-8">
            <h2 className="mb-4 text-3xl font-bold">{course.title}</h2>
            <p className="mb-6 line-clamp-3 text-base font-light leading-[24px] text-gray-600">
              <HtmlContent>{course.description}</HtmlContent>
            </p>

            {(!user || !enrolledCourses.includes(course._id)) && (
              <>
                <div className="mb-6 flex flex-wrap gap-6 text-sm">
                  <div className="flex items-center gap-1">
                    <Book className="h-5 w-5 text-green-500" />
                    <span>{course.subjectCount} Subjects</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <FileQuestion className="h-5 w-5 text-purple-500" />
                    <span>{course.questionSetCount} Question Sets</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Video className="h-5 w-5 text-red-500" />
                    <span>{course.videoCount} Video Lessons</span>
                  </div>
                </div>
                <Button className="rounded-lg px-8 py-6 text-xl font-bold text-white transition-colors duration-200">
                  Start Learning
                </Button>
              </>
            )}
            {user && enrolledCourses.includes(course._id) && (
              <>
                <div className="rounded-lg bg-slate-50 p-4">
                  <div className="mb-4 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-5 w-5 text-teal-700" />
                      <h3 className="text-lg font-semibold">Your Progress</h3>
                    </div>
                    <div className="flex items-center gap-2">
                      <Award className="h-5 w-5 text-teal-700" />
                      <span className="text-sm font-medium">
                        {progress || 0}% Complete
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="flex items-center gap-3 rounded-md bg-white p-3 shadow-sm">
                      <div className="rounded-full bg-teal-50 p-2">
                        <FileText className="h-5 w-5 text-teal-700" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-slate-500">Question Sets</p>
                        <p className="font-semibold">{`${submittedTestsCount}/${course.questionSetCount}`}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 rounded-md bg-white p-3 shadow-sm">
                      <div className="rounded-full bg-teal-50 p-2">
                        <Video className="h-5 w-5 text-teal-700" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-slate-500">Video Lessons</p>
                        <p className="font-semibold">{`${watchedCount}/${course.videoCount}`}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </Link>
    </>
  );
}

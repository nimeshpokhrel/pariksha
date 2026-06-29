"use client";

import React from "react";
import { getCourseData } from "@/hooks/courses";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { useAuth } from "@/utils/AuthContext";
import { PiVideo, PiClock } from "react-icons/pi";
import CarouselContainer from "../HomepageCarousel/CarouselContainer";
import { Progress } from "../ui/progress";
import { Button } from "../ui/button";
import HtmlContent from "@/utils/HtmlContent";
import SubjectVideoCard from "../HomepageCarousel/SubjectVideoCard";
import QuestionSetCard from "../HomepageCarousel/QuestionSetCard";
import { getWatchHistory } from "@/hooks/videos";
import Link from "next/link";
import QuestionsOfTheDayCalendar from "../QuestionsOfTheDayCalendar";
import PracticeQuestionsForm from "../PracticeQuestionsSelector/PracticeQuestionsForm";
import Spinner from "@/utils/Spinner";
import UploadThingImage from "../UploadThingImage";
import { ArrowLeft } from "lucide-react";

function CourseInfo({ link }) {
  const { testScores, userCompletedVideos, user } = useAuth();

  const { data: courseData, isPending: courseDataIsPending } = useQuery({
    queryKey: ["course-details", link],
    queryFn: (context) => {
      const [, link] = context.queryKey;
      return getCourseData(link);
    },
  });

  const { data: userWatchHistory } = useQuery({
    queryKey: ["userWatchHistory"],
    queryFn: () => getWatchHistory(),
  });

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

  function getLastWatchedVideo(userWatchHistory, courseVideoIds) {
    if (!userWatchHistory || userWatchHistory.length === 0) return null;
    for (const entry of userWatchHistory) {
      const videoId = entry?.video?._id;
      if (courseVideoIds.has(videoId)) {
        return entry.video;
      }
    }

    return null;
  }

  function getSubmittedTestsCount(courseData, testScores) {
    if (!courseData?.questionSets?.length || !testScores) return 0;

    let count = 0;
    for (let i = 0; i < courseData.questionSets.length; i++) {
      if (Object.hasOwn(testScores, courseData.questionSets[i]._id)) {
        count++;
      }
    }

    return count;
  }

  const courseVideoIds = getCourseVideoIds(courseData);

  const watchedCount = getWatchedVideosCount(
    courseVideoIds,
    userCompletedVideos
  );
  const lastWatchedVideo = getLastWatchedVideo(
    userWatchHistory,
    courseVideoIds
  );
  const submittedTestsCount = getSubmittedTestsCount(courseData, testScores);

  const progress = Math.round(
    ((submittedTestsCount * 2 + watchedCount) /
      (courseData?.questionSets?.length * 2 + courseData?.videoCount)) *
      100
  );

  return (
    <div>
      {courseDataIsPending && <Spinner />}
      {courseData && (
        <>
          <div className="relative h-full">
            <div className="absolute inset-0 z-10 bg-gradient-to-b from-slate-900/70 to-slate-900/50" />

            <div className="absolute left-0 right-0 top-10 flex aspect-[1.91/1] max-h-[480px] w-full md:bottom-0 md:top-0">
              <UploadThingImage
                src={courseData.image}
                alt={courseData.title}
                width={1800}
                height={100}
                className="object-contain"
              />
            </div>

            <div className="absolute left-0 right-0 top-4 z-30">
              <div className="content-container">
                <Link href="/courses">
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-white/80 backdrop-blur-sm hover:bg-white"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Explore Other Courses
                  </Button>
                </Link>
              </div>
            </div>
            <div className="content-container relative z-20 pb-12 pt-20 md:pt-44">
              <div className="flex flex-col items-start gap-4 md:flex-row md:gap-12">
                <div className="flex-1 text-white">
                  {courseData.entranceExamOpen && (
                    <div className="transition-all duration-300 ease-in-out hover:scale-[1.03]">
                      <Link
                        href={courseData.entranceExam}
                        target="_blank"
                        className="w-fit rounded bg-primary px-3 py-2 text-xs text-white"
                      >
                        The entrance exam form is currently open! You can fill
                        it out{" "}
                        <Link
                          href={courseData.entranceExam}
                          className="underline"
                          target="_blank"
                        >
                          here
                        </Link>
                        .
                      </Link>
                    </div>
                  )}
                  <h1 className="mb-6 mt-6 text-3xl font-bold md:text-4xl lg:text-5xl">
                    {courseData.title}
                  </h1>
                  <div className="mb-8 max-w-3xl text-lg opacity-90 md:text-justify md:text-xl">
                    <HtmlContent>{courseData.description}</HtmlContent>
                  </div>
                </div>
                <div className="w-full rounded-xl bg-white p-6 shadow-lg md:w-[300px]">
                  <h3 className="mb-4 text-lg font-semibold">Your Progress</h3>
                  <Progress value={progress || 0} className="mb-2 h-2" />
                  <p className="mb-6 text-sm text-slate-500">
                    {progress || 0}% Complete
                  </p>

                  <div className="mb-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Question Sets</span>
                      <span className="text-sm text-slate-500">
                        {`${submittedTestsCount}/${courseData.questionSets.length}`}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Video Lessons</span>
                      <span className="text-sm text-slate-500">{`${watchedCount}/${courseData.videoCount}`}</span>
                    </div>
                  </div>
                  {!user && (
                    <Link
                      href={`/courses/${courseData.link}/videos/${courseData.subjects[0].link}/${courseData.subjects[0].sections[0].videos[0]._id}`}
                      className="mt-6 w-full"
                    >
                      <Button className="w-full">Start Learning</Button>
                    </Link>
                  )}

                  {user &&
                    (lastWatchedVideo ? (
                      <Link
                        href={`/courses/${lastWatchedVideo?.course?.link}/videos/${lastWatchedVideo?.subject?.link}/${lastWatchedVideo?._id}`}
                      >
                        <Button className="w-full">Continue Learning</Button>
                      </Link>
                    ) : (
                      <Link
                        href={`/courses/${courseData.link}/videos/${courseData.subjects[0].link}/${courseData.subjects[0].sections[0].videos[0]._id}`}
                        className="mt-6 w-full"
                      >
                        <Button className="w-full">Start Learning</Button>
                      </Link>
                    ))}
                </div>
              </div>
            </div>
          </div>
          <div className="content-container">
            <div className="mt-10 bg-white">
              <h1 className="mb-4 text-2xl font-bold">Questions Of The Day</h1>
              <QuestionsOfTheDayCalendar
                courseLink={courseData.link}
                questionSets={courseData.questionsOfTheDay}
              />
            </div>

            <div className="mt-10 w-full">
              <h1 className="mb-4 text-2xl font-bold">Video Content</h1>
              <CarouselContainer
                title="Course Content"
                items={courseData.subjects
                  .filter((subject) => subject.videoCount > 0)
                  .map((subject, index) => (
                    <SubjectVideoCard
                      key={index}
                      link={`/courses/${link}/videos/${subject.link}`}
                      imageSrc={subject.image || courseData.image}
                      title={subject.title}
                      infoItems={[
                        {
                          icon: <PiVideo size={18} color="#03747E" />,
                          text: subject.videoCount,
                        },
                        {
                          icon: <PiClock size={18} color="#03747E" />,
                          text: subject.duration,
                        },
                      ]}
                      sections={subject.sections}
                    />
                  ))}
              />
            </div>
            <div className="mt-10">
              <PracticeQuestionsForm courseLink={link} />
            </div>
            <div className="mt-10 bg-white">
              <h1 className="mb-4 text-2xl font-bold">Past Question Sets</h1>
              <CarouselContainer
                title="Past Questions"
                items={courseData.questionSets
                  .filter((questionSet) => questionSet.setType === "past")
                  .map((questionSet, index) => (
                    <QuestionSetCard
                      key={index}
                      link={`/courses/${link}/tests/${questionSet.link}`}
                      imageSrc={`/previewImages/testsPreview/test-${index > 7 ? index - 8 : index}.png`}
                      title={questionSet.number}
                      userScore={
                        testScores?.[questionSet._id]
                          ? testScores[questionSet._id]
                          : "Not Attempted"
                      }
                      avgScore={parseFloat(questionSet.avgScore.toFixed(2))}
                      duration={questionSet.duration}
                      questionCount={questionSet.questionCount}
                    />
                  ))}
              />
            </div>

            <div className="mt-10 bg-white">
              <h1 className="mb-4 text-2xl font-bold">Model Question Sets</h1>
              <CarouselContainer
                title="Past Questions"
                items={courseData.questionSets
                  .filter((questionSet) => questionSet.setType === "mock")
                  .map((questionSet, index) => (
                    <QuestionSetCard
                      key={index}
                      link={`/courses/${link}/tests/${questionSet.link}`}
                      title={questionSet.number}
                      userScore={
                        testScores?.[questionSet._id]
                          ? testScores[questionSet._id]
                          : "Not Attempted"
                      }
                      avgScore={parseFloat(questionSet.avgScore.toFixed(2))}
                      duration={questionSet.duration}
                      questionCount={questionSet.questionCount}
                    />
                  ))}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default CourseInfo;

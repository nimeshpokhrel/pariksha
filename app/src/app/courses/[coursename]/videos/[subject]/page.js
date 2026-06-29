"use client";

import Spinner from "@/utils/Spinner";

import { useAuth } from "@/utils/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { getSubjectInfo } from "@/hooks/subjects";
import { ArrowLeft, PlayCircle } from "lucide-react";
import Link from "next/link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import UploadThingImage from "@/components/UploadThingImage";
import { getWatchHistory } from "@/hooks/videos";

function Subject({ params }) {
  const { userCompletedVideos, user } = useAuth();
  const courseLink = params.coursename;
  const subjectLink = params.subject;

  const { data: userWatchHistory } = useQuery({
    queryKey: ["userWatchHistory"],
    queryFn: () => getWatchHistory(),
  });

  const { data: subjectData, isPending: subjectIsPending } = useQuery({
    queryKey: ["subject", params.subject],
    queryFn: () => getSubjectInfo(params.subject),
  });

  // if (videoId)
  //   redirect(
  //     `/courses/${params.coursename}/videos/${params.subject}/${videoId}`
  //   );

  function getCourseVideoIds(subjectData) {
    const ids = new Set();
    if (!subjectData?.sections?.length) return ids;

    for (const section of subjectData.sections || []) {
      for (const video of section.videos || []) {
        ids.add(video._id);
      }
    }

    return ids;
  }

  function getWatchedVideosCount(subjectVideoIds, userCompletedVideos) {
    return userCompletedVideos.filter((videoId) => subjectVideoIds.has(videoId))
      .length;
  }

  function getLastWatchedVideo(userWatchHistory, subjectVideoIds) {
    if (!userWatchHistory || userWatchHistory.length === 0) return null;
    for (const entry of userWatchHistory) {
      const videoId = entry?.video?._id;
      if (subjectVideoIds.has(videoId)) {
        return entry.video;
      }
    }
    return null;
  }

  const subjectVideoIds = getCourseVideoIds(subjectData);

  const watchedCount = getWatchedVideosCount(
    subjectVideoIds,
    userCompletedVideos
  );
  const lastWatchedVideo = getLastWatchedVideo(
    userWatchHistory,
    subjectVideoIds
  );

  const progress = Math.round((watchedCount / subjectVideoIds?.size) * 100);

  return (
    <>
      {!subjectData && !subjectIsPending && (
        <div className="pt-8">
          <h1 className="text-center text-4xl font-bold">No subject found</h1>
        </div>
      )}
      {subjectIsPending && <Spinner />}
      {subjectData && (
        <div className="mx-auto max-w-5xl pt-4">
          <Link
            href={`/courses/${courseLink}`}
            className="mb-6 inline-flex items-center text-slate-600 hover:text-slate-900"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Course
          </Link>
          <div className="mb-8 overflow-hidden rounded-xl bg-white shadow">
            <div className="relative aspect-[1.91/1] max-h-[350px] w-full">
              <UploadThingImage
                src={subjectData.image || subjectData.course.image}
                alt={subjectData.name}
                fill
                className="object-contain"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 px-6 pb-4 text-white">
                <p className="max-w-3xl text-white/80">
                  {subjectData.course.title}
                </p>
                <h1 className="text-3xl font-bold">{subjectData.title}</h1>
              </div>
            </div>

            <div className="border-t p-6">
              <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                <div className="md:w-2/3">
                  <h2 className="mb-2 text-xl font-semibold">Your Progress</h2>
                  <Progress value={progress} className="mb-2 h-2" />
                  <p className="text-sm text-slate-500">
                    {progress}% Complete<span className="mx-2">•</span>
                    {watchedCount} / {subjectVideoIds?.size} videos completed
                  </p>
                </div>

                {!user && (
                  <Link
                    href={`/courses/${courseLink}/videos/${subjectLink}/${subjectData.sections[0].videos[0]._id}`}
                    size="lg"
                  >
                    <Button size="lg">Start Learning</Button>
                  </Link>
                )}

                {user &&
                  (lastWatchedVideo ? (
                    <Link
                      href={`/courses/${lastWatchedVideo?.course?.link}/videos/${lastWatchedVideo?.subject?.link}/${lastWatchedVideo?._id}`}
                    >
                      <Button size="lg">Continue Learning</Button>
                    </Link>
                  ) : (
                    <Link
                      href={`/courses/${courseLink}/videos/${subjectLink}/${subjectData.sections[0].videos[0]._id}`}
                      size="lg"
                    >
                      <Button size="lg">Start Learning</Button>
                    </Link>
                  ))}
              </div>
            </div>
          </div>
          <Accordion type="multiple" className="w-full rounded-full">
            {subjectData.sections.map((section, index) => {
              let count = 0;
              return (
                <AccordionItem
                  value={`section-${index}`}
                  key={index}
                  className="mb-4 rounded-xl border-0 bg-gray-100"
                >
                  <AccordionTrigger className="px-4 py-4">
                    <p className="font-semibold">{section.title}</p>
                  </AccordionTrigger>
                  <AccordionContent className="space-y-2 px-6 pt-2">
                    {section.videos.map((video) => {
                      count++;
                      return (
                        <Link
                          key={video._id}
                          href={`/courses/${courseLink}/videos/${subjectData.link}/${video._id}`}
                          className="flex w-full cursor-pointer items-center justify-between gap-4 text-base hover:underline"
                        >
                          <div className="flex items-center">
                            <PlayCircle className="mr-2 h-5 w-5 text-primary" />
                            <span>
                              {count}. {video.title}
                            </span>
                          </div>
                          <span className="text-sm text-gray-500">
                            {video.duration}
                          </span>
                        </Link>
                      );
                    })}
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        </div>
      )}
    </>
  );
}

export default Subject;

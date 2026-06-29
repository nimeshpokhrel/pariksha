"use client";

import Video from "@/components/Video";
import React, { useEffect, useRef } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { addToWatchHistory, getVideo } from "@/hooks/videos";
import { useAuth } from "@/utils/AuthContext";

import Spinner from "@/utils/Spinner";
import { LoginModal } from "@/components/LoginModal/LoginModal";

function VideoPage({ params }) {
  const courseLink = params.coursename;
  const subjectLink = params.subject;
  const videoId = params.video;

  const { user, userPending, addToEnrolledCourses } = useAuth();
  const watchHistoryAdd = useMutation({
    mutationFn: (data) => addToWatchHistory(data),
  });

  const { data: videoData, isPending } = useQuery({
    queryKey: ["video", videoId],
    queryFn: () => getVideo(videoId),
  });

  const hasRunWatchHistory = useRef(false);
  const hasRunEnroll = useRef(false);

  useEffect(() => {
    if (user && !hasRunWatchHistory.current) {
      watchHistoryAdd.mutate({ videoId: params.video });
      hasRunWatchHistory.current = true;
    }
  }, [user, params.video]);

  useEffect(() => {
    if (user && videoData && !hasRunEnroll.current) {
      addToEnrolledCourses(videoData.course);
      hasRunEnroll.current = true;
    }
  }, [user, videoData]);

  return (
    <div className={`relative`}>
      {(isPending || userPending) && <Spinner />}
      {!user && !userPending && (
        <div className="absolute inset-0 z-[20] flex flex-col items-center justify-center bg-black/50 p-6 text-center backdrop-blur-sm">
          <div className="w-full max-w-md rounded-xl border border-white/20 bg-white/10 p-8 shadow-2xl backdrop-blur-md">
            <h3 className="mb-2 text-2xl font-bold text-white">
              Login Required
            </h3>
            <p className="mb-6 text-white/80">
              Please log in to your account to access this video content.
            </p>

            <LoginModal
              redirect={`/courses/${params.coursename}/videos/${params.subject}/${params.video}`}
            />
          </div>
        </div>
      )}
      {videoData && (
        <>
          <Video
            url={videoData.videoFile}
            videoId={videoId}
            courseLink={courseLink}
            subjectLink={subjectLink}
          />
        </>
      )}
    </div>
  );
}

export default VideoPage;

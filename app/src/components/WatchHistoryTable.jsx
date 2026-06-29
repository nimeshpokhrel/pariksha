import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getWatchHistory } from "@/hooks/videos";
import { useAuth } from "@/utils/AuthContext";
import Link from "next/link";
import { WatchVideoCard } from "./WatchedVideoCard";
import CarouselContainer from "./HomepageCarousel/CarouselContainer";

export default function WatchHistoryTable({ maxItems, carousel }) {
  const { userCompletedVideos } = useAuth();
  const { data: userWatchHistory } = useQuery({
    queryKey: ["userWatchHistory", maxItems],
    queryFn: () => getWatchHistory(maxItems),
  });

  return (
    <div className="mt-4">
      {(!userWatchHistory || userWatchHistory.length === 0) && (
        <div className="text-center">
          <p className="text-md w-full text-center text-gray-600">
            You have not watched any videos yet.
          </p>
        </div>
      )}

      {carousel && userWatchHistory && userWatchHistory.length > 0 && (
        <CarouselContainer
          items={userWatchHistory.map((history, index) => (
            <Link
              href={`/courses/${history.video.course.link}/videos/${history.video.subject.link}/${history.video._id}`}
              key={index}
            >
              <WatchVideoCard
                videoData={history}
                completed={userCompletedVideos.includes(history.video._id)}
              />
            </Link>
          ))}
        />
      )}

      {!carousel && userWatchHistory && userWatchHistory.length > 0 && (
        <div className="mt-4 grid grid-cols-1 gap-x-6 gap-y-10 md:grid-cols-2 lg:grid-cols-3">
          {userWatchHistory.map((history, index) => (
            <Link
              href={`/courses/${history.video.course.link}/videos/${history.video.subject.link}/${history.video._id}`}
              key={index}
            >
              <WatchVideoCard
                videoData={history}
                completed={userCompletedVideos.includes(history.video._id)}
              />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

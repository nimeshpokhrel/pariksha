"use client";

import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function WatchVideoCard({ videoData, completed }) {
  const watchedTime = new Date(videoData.createdAt);
  const timeAgo = formatDistanceToNow(watchedTime, { addSuffix: true }).replace(
    /^about\s/,
    ""
  );

  return (
    <Card className="overflow-hidden rounded-lg border transition-shadow hover:shadow-md">
      <div className="relative">
        <Image
          src={`https://img.youtube.com/vi/${videoData.video.videoFile}/hqdefault.jpg`}
          alt={videoData.video.title}
          width={320}
          height={180}
          className="aspect-video w-full object-cover"
        />
        <div className="absolute bottom-2 right-2 rounded bg-black/70 px-1.5 py-0.5 text-xs text-white">
          {videoData.video.duration}
        </div>

        {completed && (
          <div className="absolute bottom-0 left-0 right-0 h-2 bg-gray-200">
            <div className={`h-full w-full bg-red-500`} />
          </div>
        )}
      </div>

      <CardContent className="p-3">
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-4">
            <h3 className="line-clamp-2 font-medium">
              {videoData.video.title}
            </h3>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Clock className="h-3.5 w-3.5" />
              <span>{timeAgo}</span>
            </div>
          </div>

          <span className="line-clamp-1 text-sm text-muted-foreground">
            {videoData.video.course.title} | {videoData.video.subject.title}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

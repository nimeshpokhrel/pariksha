import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Clock,
  PlayCircle,
  BookOpen,
  GraduationCap,
  Layers,
  ExternalLink,
} from "lucide-react";
import { getVideoFullData } from "@/hooks/videos";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import HtmlContent from "@/utils/HtmlContent";
import Link from "next/link";

export default function VideoOverview({ videoId }) {
  const { data: videoData } = useQuery({
    queryKey: ["videoFullData", videoId],
    queryFn: () => getVideoFullData(videoId),
  });

  const videoPosition = videoData?.section?.videos?.findIndex(
    (video) => video === videoId
  );

  return (
    <>
      {videoData && (
        <div className="mt-4 space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <CardTitle className="mb-2 text-xl font-bold text-gray-900 md:text-2xl">
                    {videoData.title}
                  </CardTitle>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{videoData.duration}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <PlayCircle className="h-4 w-4" />
                      <span>
                        Video {videoPosition + 1} of{" "}
                        {videoData.section.videoCount}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                <Layers className="h-5 w-5" />
                Course Structure
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3">
                <GraduationCap className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-600" />
                <div className="min-w-0 flex-1">
                  <Link
                    href={`
                    /courses/${videoData.course.link}
                  `}
                    className="flex items-center gap-2 font-medium text-gray-900 hover:underline"
                  >
                    {videoData.course.title}
                    <ExternalLink className="h-4 w-4" />
                  </Link>
                  <div className="text-sm text-gray-600">Course</div>
                </div>
              </div>

              <Separator className="my-2" />

              <div className="flex items-start gap-3">
                <BookOpen className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-600" />
                <div className="min-w-0 flex-1">
                  <Link
                    href={`
                    /courses/${videoData.course.link}/videos/${videoData.subject.link}
                  `}
                    className="flex items-center gap-2 font-medium text-gray-900 hover:underline"
                  >
                    {videoData.subject.title}
                    <ExternalLink className="h-4 w-4" />
                  </Link>
                  <div className="text-sm text-gray-600">
                    {videoData.subject.videoCount} videos •{" "}
                    {videoData.subject.duration}
                  </div>
                </div>
              </div>

              <Separator className="my-2" />

              {/* Section */}
              <div className="flex items-start gap-3">
                <Layers className="mt-0.5 h-5 w-5 flex-shrink-0 text-purple-600" />
                <div className="min-w-0 flex-1">
                  <div className="font-medium text-gray-900">
                    {videoData.section.title}
                  </div>
                  <div className="text-sm text-gray-600">
                    {videoData.section.videoCount} videos in this section
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold">
                About This Course
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm max-w-none leading-relaxed text-gray-700">
                <HtmlContent>{videoData?.course?.description}</HtmlContent>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {videoData.course.subjects.map((subject, index) => (
                  <Badge variant="outline" className="text-xs" key={index}>
                    {subject.title}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}

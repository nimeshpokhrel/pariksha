"use client";

import Drawer from "@/components/Drawer/Drawer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import OverviewDrawer from "@/components/OverviewDrawer";
import Link from "next/link";
import { useState } from "react";
import { MdOutlineNavigateNext, MdOutlineNavigateBefore } from "react-icons/md";
import BannerAd from "@/components/BannerAd";
import { ExternalLink } from "lucide-react";
import VideoOverview from "@/components/VideoOverview";

export default function Layout({ children, params }) {
  const [nextVideo, setNextVideo] = useState(null);
  const [prevVideo, setPrevVideo] = useState(null);

  return (
    <div className="videoPageContainer relative flex w-full">
      <div className="relative w-full flex-1">
        <div className="relative">
          {children}

          <div>
            {prevVideo && (
              <button
                className="-ml-1 cursor-pointer bg-primary bg-opacity-50 py-1 text-gray-100 hover:bg-opacity-100 hover:text-white"
                style={{
                  borderRadius: 0,
                  position: "absolute",
                  top: "50%",
                  left: "0",
                }}
              >
                <Link
                  href={`/courses/${params.coursename}/videos/${params.subject}/${prevVideo}`}
                >
                  <MdOutlineNavigateBefore size={32} />
                </Link>
              </button>
            )}
            {nextVideo && (
              <button
                className="-mr-1 cursor-pointer bg-primary bg-opacity-50 py-1 text-gray-100 hover:bg-opacity-100 hover:text-white"
                style={{
                  borderRadius: 0,
                  position: "absolute",
                  top: "50%",
                  right: "0",
                }}
              >
                <Link
                  href={`/courses/${params.coursename}/videos/${params.subject}/${nextVideo}`}
                >
                  <MdOutlineNavigateNext size={32} />
                </Link>
              </button>
            )}
          </div>
        </div>

        <div className="flex w-full flex-col items-center">
          <BannerAd currentPage={3} className="my-0" />
        </div>

        <div className="m-auto w-full max-w-[1300px] border-t-2 border-gray-dark">
          <Tabs
            defaultValue="overview"
            className="my-0 rounded-none border-0 text-base font-medium shadow-none data-[state=active]:border-b-2 data-[state=active]:border-b-primary data-[state=active]:text-primary data-[state=active]:shadow-none"
          >
            <TabsList className="scrollbar-hide flex w-full justify-start overflow-x-auto overflow-y-hidden whitespace-nowrap rounded-none border-b-2 border-b-gray-200 bg-white py-5">
              <TabsTrigger
                value="course"
                className="my-0 hidden rounded-none border-0 text-base font-medium shadow-none data-[state=active]:border-b-2 data-[state=active]:border-b-primary data-[state=active]:text-primary data-[state=active]:shadow-none sm:flex"
              >
                <Link
                  href={`/courses/${params.coursename}`}
                  className="flex w-full items-center hover:underline"
                >
                  Course
                </Link>
                <ExternalLink className="ml-2 h-4 w-4" />
              </TabsTrigger>
              <TabsTrigger
                value="subject"
                className="my-0 hidden rounded-none border-0 text-base font-medium shadow-none data-[state=active]:border-b-2 data-[state=active]:border-b-primary data-[state=active]:text-primary data-[state=active]:shadow-none sm:flex"
              >
                <Link
                  href={`/courses/${params.coursename}/videos/${params.subject}`}
                  className="flex w-full items-center hover:underline"
                >
                  Subject
                  <ExternalLink className="ml-2 h-4 w-4" />
                </Link>
              </TabsTrigger>
              <TabsTrigger
                value="overview"
                className="my-0 rounded-none border-0 text-base font-medium shadow-none data-[state=active]:border-b-2 data-[state=active]:border-b-primary data-[state=active]:text-primary data-[state=active]:shadow-none"
              >
                Overview
              </TabsTrigger>
              <TabsTrigger
                value="course-content"
                className="my-0 rounded-none border-0 text-base font-medium shadow-none data-[state=active]:border-b-2 data-[state=active]:border-b-primary data-[state=active]:text-primary data-[state=active]:shadow-none"
              >
                Course&nbsp;Content
              </TabsTrigger>

              <TabsTrigger
                value="notes"
                className="my-0 rounded-none border-0 text-base font-medium shadow-none data-[state=active]:border-b-2 data-[state=active]:border-b-primary data-[state=active]:text-primary data-[state=active]:shadow-none"
              >
                Notes
              </TabsTrigger>
            </TabsList>
            <div className="px-4">
              <TabsContent value="course"></TabsContent>
              <TabsContent value="subject"></TabsContent>
              <TabsContent value="overview">
                <div className="m-auto w-full max-w-[800px]">
                  <VideoOverview videoId={params.video} />
                </div>
              </TabsContent>
              <TabsContent value="course-content">
                <OverviewDrawer
                  videoId={params.video}
                  courseLink={params.coursename}
                  subjectLink={params.subject}
                />
              </TabsContent>
              <TabsContent value="notes">
                <div className="m-auto w-full max-w-[800px]">
                  <p>Coming Soon !!</p>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
      <Drawer
        videoId={params.video}
        courseLink={params.coursename}
        subjectLink={params.subject}
        setNextVideo={(id) => setNextVideo(id)}
        setPrevVideo={(id) => setPrevVideo(id)}
      />
    </div>
  );
}

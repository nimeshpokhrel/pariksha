"use client";

import React, { useEffect, useState } from "react";

import styles from "./Drawer.module.css";

import { Button } from "@chakra-ui/react";

import { FaArrowLeft } from "react-icons/fa6";
import { RxCross1 } from "react-icons/rx";

import SubjectDrawer from "../SubjectDrawer/SubjectDrawer";
import { useQuery } from "@tanstack/react-query";
import { getSubjectInfo } from "@/hooks/subjects";

export default function Drawer({
  courseLink,
  subjectLink,
  videoId,
  setNextVideo,
  setPrevVideo,
}) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    const drawerOpen = localStorage.getItem("drawerOpen");
    setDrawerOpen(drawerOpen === "true");
    if (drawerOpen === null) {
      setDrawerOpen(true);
    }
  }, []);

  const {
    data: subjectData,
    isPending: subjectIsPending,
    isError: subjectIsError,
  } = useQuery({
    queryKey: ["subject", subjectLink],
    queryFn: () => getSubjectInfo(subjectLink),
  });
  const getPrevNextVideosInSections = (sections, currentId) => {
    for (let i = 0; i < sections.length; i++) {
      const section = sections[i];
      const currentIndex = section.videos.findIndex(
        (video) => video._id === currentId
      );

      if (currentIndex !== -1) {
        const prevVideo =
          currentIndex > 0
            ? section.videos[currentIndex - 1]
            : i === 0
              ? null
              : sections[i - 1].videos[sections[i - 1].videos.length - 1];

        const nextVideo =
          currentIndex < section.videos.length - 1
            ? section.videos[currentIndex + 1]
            : i === sections.length - 1
              ? null
              : sections[i + 1].videos[0];

        return {
          sectionId: section.sectionId,
          previous: prevVideo,
          next: nextVideo,
        };
      }
    }
  };

  useEffect(() => {
    if (subjectData) {
      const { previous, next } = getPrevNextVideosInSections(
        subjectData.sections,
        videoId
      );
      setPrevVideo(previous?._id);
      setNextVideo(next?._id);
    }
  }, [subjectData, videoId]);

  return (
    <div
      className={`${styles.drawerWholeContainer} ${drawerOpen ? styles.drawerOpen : ""}`}
    >
      {subjectData && (
        <Button
          colorScheme="teal"
          onClick={() => {
            setDrawerOpen(true);
            localStorage.setItem("drawerOpen", true);
          }}
          leftIcon={<FaArrowLeft />}
          className={`${styles.button} z-[20] cursor-pointer`}
          style={{
            borderRadius: 0,
            position: "absolute",
            top: "100px",
            right: "0",
            display: `${drawerOpen ? "none" : ""}`,
          }}
        >
          Course Content
        </Button>
      )}

      <div
        className={`${styles.drawerContainer} ${
          drawerOpen ? styles.show : ""
        } pl-0.5`}
      >
        <div
          className={`${styles.drawerHeader} flex items-center justify-between border-b-2 border-solid border-[#d1d7dc] px-8 py-4`}
        >
          <p className="font-semibold">Course Content</p>
          <button
            onClick={() => {
              setDrawerOpen(false);
              localStorage.setItem("drawerOpen", false);
            }}
          >
            <RxCross1 />
          </button>
        </div>

        {subjectData && (
          <SubjectDrawer
            subjectData={subjectData}
            courseLink={courseLink}
            subjectLink={subjectLink}
            videoId={videoId}
          />
        )}
      </div>
    </div>
  );
}

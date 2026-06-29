import React from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Box,
} from "@chakra-ui/react";
import { MdOndemandVideo } from "react-icons/md";
import Link from "next/link";
import { useAuth } from "@/utils/AuthContext";

import { Checkbox } from "../ui/checkbox";

export default function SubjectDrawer({
  subjectData,
  courseLink,
  videoId,
  subjectLink,
}) {
  const {
    userCompletedVideos,
    addToUserCompletedVideos,
    removeFromUserCompletedVideos,
  } = useAuth();

  const findIndexByVideoId = (array, videoId) => {
    for (let i = 0; i < array.length; i++) {
      const videos = array[i].videos;
      if (videos.some((video) => video._id === videoId)) {
        return i;
      }
    }
    return 0;
  };
  let count = 0;

  return (
    <Accordion
      allowMultiple={true}
      defaultIndex={[findIndexByVideoId(subjectData.sections, videoId)]}
    >
      {subjectData.sections.map((section, index) => (
        <AccordionItem key={index}>
          <h2 className="border-b-2 border-white">
            <AccordionButton
              bg={"gray.200"}
              px={4}
              py={4}
              border={2}
              _hover={{ bg: "gray.300" }}
            >
              <Box as="span" flex="1" textAlign="left">
                <p className="font-semibold">{section.title}</p>
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel px={0} py={0} pb={0.5}>
            {section.videos.map((video, index) => {
              count++;
              return (
                <div
                  className={`flex w-full cursor-pointer items-start gap-4 hover:bg-[#D1D7DC] ${videoId === video._id ? "bg-[#D1D7DC]" : ""}`}
                  key={index}
                >
                  <div className="mt-3 pl-4">
                    <Checkbox
                      checked={
                        userCompletedVideos
                          ? userCompletedVideos.length > 0
                            ? userCompletedVideos.includes(video._id)
                            : false
                          : false
                      }
                      onCheckedChange={() => {
                        if (userCompletedVideos.includes(video._id)) {
                          removeFromUserCompletedVideos(video._id);
                        } else {
                          addToUserCompletedVideos(video._id);
                        }
                      }}
                    />
                  </div>
                  <Link
                    href={`/courses/${courseLink}/videos/${subjectLink}/${video._id}`}
                    className="w-full py-2 pr-4"
                  >
                    <div className="w-full">
                      <p className="mb-2 w-full text-sm">
                        {count}. {video.title}
                      </p>
                      <p className="flex w-full items-center gap-2 text-xs text-gray-600">
                        <MdOndemandVideo size={18} />
                        {video.duration}
                      </p>
                    </div>
                  </Link>
                </div>
              );
            })}
          </AccordionPanel>
        </AccordionItem>
      ))}
    </Accordion>
  );
}

import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { PlayCircle } from "lucide-react";
import type { Subject } from "@/types/types";
import Link from "next/link";
import { appLink } from "@/lib/config";

export default function SubjectDrawer({
  courseLink,
  subjectData,
}: {
  courseLink: string;
  subjectData: Subject;
}) {
  return (
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
                    href={`${appLink}/courses/${courseLink}/videos/${subjectData.link}/${video._id}`}
                    target="_blank"
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
  );
}

"use client";

import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, Clock, GraduationCap, School } from "lucide-react";
import Link from "next/link";
import UploadThingImage from "./UploadThingImage";
import { DegreeCardType } from "@/types/types";

export function DegreeCard({
  name,
  coverImage,
  shortName,
  university,
  sector,
  duration,
  semesterCount,
  link,
}: DegreeCardType) {
  return (
    <Card className="group relative h-full cursor-pointer overflow-hidden transition-all duration-300 hover:shadow-lg">
      <div className="absolute right-1.5 top-1 z-[1]">
        <span className="rounded-md bg-primary px-2 py-1 text-[8px] text-white sm:text-[11px]">
          {sector.name}
        </span>
      </div>
      <Link href={`/degrees/${link}`} className="flex h-full flex-col">
        <div className="relative h-48 w-full">
          <UploadThingImage
            imageLink={coverImage}
            alt={`${name}`}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>

        <CardContent className="relative flex flex-1 flex-col pb-4 pt-2">
          <div className="flex flex-1 flex-col justify-between space-y-4">
            <div className="flex h-full flex-col justify-between gap-4">
              <h3 className="text-base font-semibold sm:text-lg">{name}</h3>
              <div>
                <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <GraduationCap className="h-4 w-4" />
                  {shortName}
                </p>
                <p className="mt-1.5 flex items-center gap-1.5 text-sm text-muted-foreground">
                  <School className="h-4 w-4" />
                  {university.name}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between border-t pt-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                <span>{duration} Years</span>
              </div>
              <div className="flex items-center gap-1.5">
                <BookOpen className="h-4 w-4" />
                <span>{semesterCount} Semesters</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
}

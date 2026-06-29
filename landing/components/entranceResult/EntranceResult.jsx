"use client";

import { Clock, GraduationCap, School } from "lucide-react";
import React from "react";
import { Card, CardContent } from "../ui/card";
import Link from "next/link";
import UploadThingImage from "../UploadThingImage";
import entranceData from "./EntranceData.json";

const EntranceResult = () => {
  return (
    <>
      <div className="min-h-screen bg-slate-50">
        <div className="container mx-auto px-4 py-8 md:px-6">
          <div className="mb-8 space-y-4 text-center">
            <h1 className="text-4xl font-bold tracking-tight">
              View Entrance Exam Results
            </h1>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {entranceData.map((entrance) => (
              <Card
                key={entrance._id}
                className="group relative h-full cursor-pointer overflow-hidden transition-all duration-300 hover:shadow-lg"
              >
                <div className="absolute right-1.5 top-1 z-[1]">
                  <span className="rounded-md bg-primary px-2 py-1 text-[8px] text-white sm:text-[11px]">
                    {entrance.badge}
                  </span>
                </div>
                <Link
                  href={`/entrance-result/${entrance.slug}`}
                  className="flex h-full flex-col"
                >
                  <div className="relative h-48 w-full">
                    <UploadThingImage
                      imageLink={entrance.imageLink}
                      alt={entrance.name}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>

                  <CardContent className="relative flex flex-1 flex-col pb-4 pt-2">
                    <div className="flex flex-1 flex-col justify-between space-y-4">
                      <div className="flex h-full flex-col justify-between gap-4">
                        <h3 className="text-base font-semibold sm:text-lg">
                          {entrance.name}
                        </h3>
                        <div>
                          <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
                            <GraduationCap className="h-4 w-4" />
                            {entrance.shortName}
                          </p>
                          <p className="mt-1.5 flex items-center gap-1.5 text-sm text-muted-foreground">
                            <School className="h-4 w-4" />
                            {entrance.university}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between border-t pt-2 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1.5">
                          <Clock className="h-4 w-4" />
                          <span>Exam Held on {entrance.examCondutedOn}</span>
                        </div>
                        {/* <div className="flex items-center gap-1.5">
                        <BookOpen className="h-4 w-4" />
                        <span>fhgf</span>
                      </div> */}
                      </div>
                    </div>
                  </CardContent>
                </Link>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default EntranceResult;

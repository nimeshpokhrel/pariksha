"use client";

import React, { useEffect, useState } from "react";

import SubjectDrawer from "./SubjectDrawer/SubjectDrawer";
import { useQuery } from "@tanstack/react-query";
import { getSubjectInfo } from "@/hooks/subjects";

export default function OverviewDrawer({ subjectLink, courseLink, videoId }) {
  const {
    data: subjectData,
    isPending: subjectIsPending,
    isError: subjectIsError,
  } = useQuery({
    queryKey: ["subject", subjectLink],
    queryFn: () => getSubjectInfo(subjectLink),
  });
  return (
    <div className="m-auto w-full max-w-[800px]">
      {subjectData && (
        <SubjectDrawer
          subjectData={subjectData}
          courseLink={courseLink}
          subjectLink={subjectLink}
          videoId={videoId}
        />
      )}
    </div>
  );
}

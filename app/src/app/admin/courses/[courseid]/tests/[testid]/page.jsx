"use client";

import AdminQuestionSetInfo from "@/components/adminComponents/AdminQuestionSetInfo/AdminQuestionSetInfo";
import React from "react";

export default function page({ params }) {
  return (
    <div>
      <AdminQuestionSetInfo
        courseId={params.courseid}
        questionSetId={params.testid}
      />
    </div>
  );
}

"use client";

import React from "react";
import CourseInfoAdmin from "@/components/adminComponents/AdminCourseInfo/AdminCourseInfo";

export default function page({ params }) {
  return (
    <div>
      <CourseInfoAdmin courseId={params.courseid} />
    </div>
  );
}

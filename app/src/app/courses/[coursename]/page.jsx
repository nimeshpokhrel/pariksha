import React from "react";
import CourseInfo from "@/components/CourseInfo/CourseInfo";

export default function page({ params }) {
  return (
    <div>
      <CourseInfo link={params.coursename} />
    </div>
  );
}

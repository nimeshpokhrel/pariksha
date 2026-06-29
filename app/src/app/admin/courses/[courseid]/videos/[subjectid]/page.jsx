"use client";

import AdminSubjectInfo from "@/components/adminComponents/AdminSubjectInfo/AdminSubjectInfo";

export default function page({ params }) {
  return (
    <div>
      <AdminSubjectInfo
        subjectId={params.subjectid}
        courseId={params.courseid}
      />
    </div>
  );
}

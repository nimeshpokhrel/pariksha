"use client";

import AdminSectionInfo from "@/components/adminComponents/AdminSectionInfo/AdminSectionInfo";

export default function page({ params }) {
  return (
    <div>
      <AdminSectionInfo
        courseId={params.courseid}
        sectionId={params.sectionid}
        subjectId={params.subjectid}
      />
    </div>
  );
}

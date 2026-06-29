import AdminQuestionSubjectInfo from "@/components/adminComponents/AdminQuestionSubjectInfo/AdminQuestionSubjectInfo";
import React from "react";

export default function page({ params }) {
  return (
    <div className="content-container">
      <AdminQuestionSubjectInfo
        courseId={params.courseid}
        questionSubjectId={params.subjectid}
        questionSetId={params.testid}
      />
    </div>
  );
}

"use client";

import { useQuery } from "@tanstack/react-query";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { getCourseData } from "@/hooks/admin/course";
import { getSubjectData } from "@/hooks/admin/subject";
import { getSectionData } from "@/hooks/admin/section";
import { getQuestionSetData } from "@/hooks/admin/questionSet";
import { getQuestionSubjectData } from "@/hooks/admin/questionSubject";
import { Home } from "lucide-react";

export default function BreadCrumbContainer({
  courseId,
  subjectId,
  sectionId,
  questionSetId,
  questionSubjectId,
  questionsOfTheDayId,
  courses,
  universities,
  sectors,
  degrees,
  colleges,
  ads,
}) {
  const { data: courseData } = useQuery({
    queryKey: ["course-details", courseId],
    queryFn: (context) => {
      const [, courseId] = context.queryKey;
      if (!courseId) return {};
      return getCourseData(courseId);
    },
  });

  const { data: subjectData } = useQuery({
    queryKey: ["subject", subjectId],
    queryFn: (context) => {
      const [, subjectId] = context.queryKey;
      if (!subjectId) return {};
      return getSubjectData(subjectId);
    },
  });

  const { data: sectionData } = useQuery({
    queryKey: ["section", sectionId],
    queryFn: (context) => {
      const [, sectionId] = context.queryKey;
      if (!sectionId) return {};
      return getSectionData(sectionId);
    },
  });

  const { data: questionSetData } = useQuery({
    queryKey: ["questionSetData", questionSetId],
    queryFn: (context) => {
      const [, questionSetId] = context.queryKey;
      if (!questionSetId) return {};
      return getQuestionSetData(questionSetId);
    },
  });
  const { data: questionSubjectData } = useQuery({
    queryKey: ["questionSubjectData", questionSubjectId],
    queryFn: (context) => {
      const [, questionSubjectId] = context.queryKey;
      if (!questionSubjectId) return {};
      return getQuestionSubjectData(questionSubjectId);
    },
  });

  return (
    <Breadcrumb className="mb-6">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/admin">
            <Home className="h-4 w-4" />
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <>
          {courses && <BreadcrumbPage>Courses</BreadcrumbPage>}
          {universities && <BreadcrumbPage>Universities</BreadcrumbPage>}
          {sectors && <BreadcrumbPage>Sectors</BreadcrumbPage>}
          {degrees && <BreadcrumbPage>Degrees</BreadcrumbPage>}
          {colleges && <BreadcrumbPage>Colleges</BreadcrumbPage>}
          {ads && <BreadcrumbPage>Ads</BreadcrumbPage>}
        </>
        <>
          {courseId && courseData && (
            <>
              <BreadcrumbItem>
                <BreadcrumbLink href="/admin/courses">Courses</BreadcrumbLink>
                <BreadcrumbSeparator />
                {subjectId || questionSetId || questionsOfTheDayId ? (
                  <>
                    <BreadcrumbLink href={`/admin/courses/${courseId}`}>
                      {courseData.title}
                    </BreadcrumbLink>
                    <BreadcrumbSeparator />
                  </>
                ) : (
                  <BreadcrumbPage>{courseData.title}</BreadcrumbPage>
                )}
              </BreadcrumbItem>
            </>
          )}
          {subjectId && subjectData && (
            <>
              <BreadcrumbItem>
                {sectionId ? (
                  <>
                    <BreadcrumbLink
                      href={`/admin/courses/${courseId}/videos/${subjectId}`}
                    >
                      {subjectData.title}
                    </BreadcrumbLink>
                    <BreadcrumbSeparator />
                  </>
                ) : (
                  <BreadcrumbPage>{subjectData.title}</BreadcrumbPage>
                )}
              </BreadcrumbItem>
            </>
          )}
          {sectionId && sectionData && (
            <>
              <BreadcrumbItem>
                <BreadcrumbPage>{sectionData.title}</BreadcrumbPage>
              </BreadcrumbItem>
            </>
          )}
          {questionSetId && questionSetData && (
            <>
              <BreadcrumbItem>
                {questionSubjectId ? (
                  <>
                    <BreadcrumbLink
                      href={`/admin/courses/${courseId}/tests/${questionSetId}`}
                    >
                      {questionSetData.title}
                    </BreadcrumbLink>
                    <BreadcrumbSeparator />
                  </>
                ) : (
                  <BreadcrumbPage>{questionSetData.title}</BreadcrumbPage>
                )}
              </BreadcrumbItem>
            </>
          )}
          {questionSubjectId && questionSubjectData && (
            <>
              <BreadcrumbItem>
                <BreadcrumbPage>{questionSubjectData.name}</BreadcrumbPage>
              </BreadcrumbItem>
            </>
          )}
          {questionsOfTheDayId && (
            <BreadcrumbPage>{questionsOfTheDayId}</BreadcrumbPage>
          )}
        </>
      </BreadcrumbList>
    </Breadcrumb>
  );
}

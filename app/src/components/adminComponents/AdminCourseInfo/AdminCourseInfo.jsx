"use client";

import { useQuery } from "@tanstack/react-query";
import { getCourseData } from "@/hooks/admin/course";
import SubjectsList from "./SubjectsList";
import TestsList from "./TestsList";
import BreadCrumbContainer from "../BreadCrumbContainer";
import QuestionsOfTheDay from "./QuestionsOfTheDay";

function CourseInfoAdmin({ courseId }) {
  const { data: courseData } = useQuery({
    queryKey: ["course-details", courseId],
    queryFn: (context) => {
      const [, courseId] = context.queryKey;
      return getCourseData(courseId);
    },
  });

  return (
    <div>
      {courseData && (
        <div className="content-container">
          <BreadCrumbContainer courseId={courseId} />
          {/* <QuestionsOfTheDay
            questionsOfTheDay={courseData.questionsOfTheDay}
            courseId={courseData._id}
          /> */}
          <SubjectsList courseData={courseData} />
          <TestsList courseData={courseData} />
        </div>
      )}
    </div>
  );
}

export default CourseInfoAdmin;

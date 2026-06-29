"use client";

import { useQuery } from "@tanstack/react-query";
import { getCourseData } from "@/hooks/admin/course";

function Layout({ children, params }) {
  const { courseid } = params;

  const { data: courseData } = useQuery({
    queryKey: ["course-details", courseid],
    queryFn: (context) => {
      const [, courseid] = context.queryKey;
      return getCourseData(courseid);
    },
  });

  return (
    <>
      <div>
        <h1 className="mb-6 border-b pb-4 pt-4 text-center text-2xl font-semibold">
          {courseData?.title}
        </h1>
        {children}
      </div>
    </>
  );
}

export default Layout;

"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchCourses, useFetchCourses } from "@/hooks/courses";
import { useAuth } from "@/utils/AuthContext";
import EnrolledCourseCard from "./EnrolledCourseCard";

export default function EnrolledCourses() {
  // const { data: allCourses } = useQuery({
  //   queryKey: ["courses"],
  //   queryFn: () => fetchCourses(),
  // });

  const { data: allCourses } = useFetchCourses();

  const { enrolledCourses } = useAuth();

  const filteredCourses =
    allCourses && allCourses.length > 0
      ? allCourses.filter((course) => enrolledCourses.includes(course._id))
      : [];

  return (
    <>
      {filteredCourses && filteredCourses.length > 0 && (
        <main className="mb-32">
          <div className="mb-8 mt-8 flex flex-col space-y-4">
            <h1 className="text-4xl font-bold tracking-tight">
              Continue Learning
            </h1>
            <p className="max-w-2xl text-muted-foreground">
              Resume your learning journey and keep preparing for your exams
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8">
            {filteredCourses.map((course) => (
              <EnrolledCourseCard key={course._id} course={course} />
            ))}
          </div>
        </main>
      )}
    </>
  );
}

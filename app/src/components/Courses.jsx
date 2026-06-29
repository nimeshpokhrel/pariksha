"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import CourseCard from "./CourseCard";
import { SearchBar } from "./SearchBar";
import { fetchCourses, useFetchCourses } from "@/hooks/courses";

export default function Courses({ hideSearch }) {
  // const { data: allCourses } = useQuery({
  //   queryKey: ["courses"],
  //   queryFn: () => fetchCourses(),
  // });

  const { data: allCourses } = useFetchCourses();

  const [searchTerm, setSearchTerm] = useState("");

  const filteredCourses =
    allCourses && allCourses.length > 0
      ? allCourses.filter(
          (course) =>
            course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            course.description.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : [];

  return (
    <main>
      <div className="mb-8 mt-8 flex flex-col space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">Our Courses</h1>
        <p className="max-w-2xl text-muted-foreground">
          Enroll in our Entrance Preparation Courses by Pariksha and get ready
          to excel in your entrance exams.
        </p>
        {!hideSearch && (
          <div className="mb-12">
            <SearchBar
              onSearch={setSearchTerm}
              placeholder="Search for course..."
            />
          </div>
        )}
      </div>

      {filteredCourses && filteredCourses.length > 0 && (
        <div className="grid grid-cols-1 gap-8">
          {filteredCourses.map((course) => (
            <CourseCard key={course._id} course={course} />
          ))}
        </div>
      )}
    </main>
  );
}

import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { fetchCourses, getCourseData } from "@/hooks/courses";
import Courses from "@/components/Courses";
import EnrolledCourses from "@/components/EnrolledCourses";
import CollegeRecommendNavbar from "@/components/CollegeRecommendNavbar";

export default async function Course() {
  return (
    <>
      <div>
          <div className="content-container">
            <CollegeRecommendNavbar />
            {/* <EnrolledCourses /> */}
            <Courses hideSearch={false} />
          </div>
      </div>
    </>
  );
}

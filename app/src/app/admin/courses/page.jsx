import AdminCoursesList from "@/components/adminComponents/AdminCoursesList/AdminCoursesList";

import Spinner from "@/utils/Spinner";
import { Suspense } from "react";

export default function Courses() {
  return (
    <div className="content-container">
      <Suspense fallback={<Spinner />}>
        <AdminCoursesList />
      </Suspense>
    </div>
  );
}

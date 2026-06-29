import AdminCollegeRecommendList from "@/components/adminComponents/AdminCollegeRecommendList/AdminCollegeRecommendList";

import Spinner from "@/utils/Spinner";
import { Suspense } from "react";

export default function CollegeRecommendation() {
  return (
    <div className="content-container">
      <Suspense fallback={<Spinner />}>
        <AdminCollegeRecommendList />
      </Suspense>
    </div>
  );
}

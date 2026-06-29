import AdminCollegesList from "@/components/adminComponents/AdminCollegesList/AdminCollegesList";

import Spinner from "@/utils/Spinner";
import { Suspense } from "react";

export default function Colleges() {
  return (
    <div className="content-container">
      <Suspense fallback={<Spinner />}>
        <AdminCollegesList />
      </Suspense>
    </div>
  );
}

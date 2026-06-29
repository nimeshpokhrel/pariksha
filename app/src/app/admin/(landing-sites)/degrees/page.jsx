import AdminDegreesList from "@/components/adminComponents/AdminDegreesList/AdminDegreesList";

import Spinner from "@/utils/Spinner";
import { Suspense } from "react";

export default function Colleges() {
  return (
    <div className="content-container">
      <Suspense fallback={<Spinner />}>
        <AdminDegreesList />
      </Suspense>
    </div>
  );
}

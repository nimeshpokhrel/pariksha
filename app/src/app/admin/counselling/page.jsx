import AdminCounsellingList from "@/components/adminComponents/AdminCounsellingList/AdminCounsellingList";

import Spinner from "@/utils/Spinner";
import { Suspense } from "react";

export default function Counselling() {
  return (
    <div className="content-container">
      <Suspense fallback={<Spinner />}>
        <AdminCounsellingList />
      </Suspense>
    </div>
  );
}

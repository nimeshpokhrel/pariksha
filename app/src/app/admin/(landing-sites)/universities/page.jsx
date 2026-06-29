import AdminUniversitiesList from "@/components/adminComponents/AdminUniversitiesList/AdminUniversitiesList";

import Spinner from "@/utils/Spinner";
import { Suspense } from "react";

export default function Universities() {
  return (
    <div className="content-container">
      <Suspense fallback={<Spinner />}>
        <AdminUniversitiesList />
      </Suspense>
    </div>
  );
}

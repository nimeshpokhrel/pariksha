import AdminSectorsList from "@/components/adminComponents/AdminSectorsList/AdminSectorsList";
import Spinner from "@/utils/Spinner";
import { Suspense } from "react";

export default function Universities() {
  return (
    <div className="content-container">
      <Suspense fallback={<Spinner />}>
        <AdminSectorsList />
      </Suspense>
    </div>
  );
}

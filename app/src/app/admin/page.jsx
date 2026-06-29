"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import Spinner from "@/utils/Spinner";
import { Suspense } from "react";
import { useAuth } from "@/utils/AuthContext";

export default function Page() {
  const { user } = useAuth();
  console.log(user);
  return (
    <Suspense fallback={<Spinner />}>
      <div className="content-container flex flex-col gap-2 pt-8">
        <h1 className="text-3xl font-bold">App</h1>
        <Link href="/admin/courses">
          <Button>Courses</Button>
        </Link>
        {user && user.userType == "SuperAdmin" && (
          <Link href="/admin/users">
            <Button>Users</Button>
          </Link>
        )}
        <h1 className="mt-12 text-3xl font-bold">Landing Site</h1>
        <Link href="/admin/universities">
          <Button>Universities</Button>
        </Link>
        <Link href="/admin/sectors">
          <Button>Sectors</Button>
        </Link>
        <Link href="/admin/courses">
          <Button>Courses</Button>
        </Link>
        <Link href="/admin/degrees">
          <Button>Degrees</Button>
        </Link>
        <Link href="/admin/colleges">
          <Button>Colleges</Button>
        </Link>
        <h1 className="mt-12 text-3xl font-bold">Forms</h1>
        <Link href="/admin/counselling">
          <Button>Counselling</Button>
        </Link>
        <Link href="/admin/college-recommendation">
          <Button>College Recommendation</Button>
        </Link>
      </div>
    </Suspense>
  );
}

"use client";

import withAuth from "@/utils/withAuth";
import React from "react";

import { useAuth } from "@/utils/AuthContext";
import PrimaryButton from "@/components/PrimaryButton";
import Link from "next/link";
import WatchHistoryTable from "@/components/WatchHistoryTable";
import TestHistoryTable from "@/components/TestHistoryTable";
import { UserAvatar } from "@/components/UserAvatar";

function Profile() {
  const { user } = useAuth();

  return (
    <div>
      {user && (
        <div className="content-container">
          <div className="mt-8 border-b-2 pb-8">
            <div className="flex items-center gap-3 md:gap-6">
              <UserAvatar name={user.fullName} size="xxl" />
              <div>
                <h1 className="mb-2 text-lg font-semibold text-primary md:text-3xl">
                  {user.fullName}
                </h1>
                <p className="whitespace-pre-wrap break-words break-all text-sm md:text-lg">
                  {user.email}
                </p>
                <p className="text-sm md:text-lg">{user.contactNumber}</p>
              </div>
            </div>
          </div>
          <div className="mt-8 border-b-2 pb-8">
            <div className="mb-6 flex items-center justify-between">
              <h1 className="text-xl font-bold text-primary">Watch History</h1>
              <Link href="/watch-history">
                <PrimaryButton
                  text={"View All Watch History"}
                  className={"hidden rounded-lg md:block"}
                />
                <PrimaryButton
                  text={"View All"}
                  className={"block rounded-lg md:hidden"}
                />
              </Link>
            </div>
            <WatchHistoryTable maxItems={10} carousel={true} />
          </div>
          <div className="mt-8">
            <div className="mb-4 flex items-center justify-between">
              <h1 className="text-xl font-bold text-primary">
                Submitted Tests
              </h1>
              <Link href="/test-history">
                <PrimaryButton
                  text={"View All Test History"}
                  className={"hidden rounded-lg md:block"}
                />
                <PrimaryButton
                  text={"View All"}
                  className={"block rounded-lg md:hidden"}
                />
              </Link>
            </div>

            <TestHistoryTable maxItems={5} />
          </div>
        </div>
      )}
    </div>
  );
}

export default withAuth(Profile);

"use client";

import React from "react";
import WatchHistoryTable from "@/components/WatchHistoryTable";
import withAuth from "@/utils/withAuth";

function page() {
  return (
    <div className="content-container pt-8">
      <h1 className="mb-6 text-3xl font-bold">Your Watch History</h1>
      <WatchHistoryTable />
    </div>
  );
}
export default withAuth(page);

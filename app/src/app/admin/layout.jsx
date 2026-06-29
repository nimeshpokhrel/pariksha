"use client";

import withAuthAdmin from "@/utils/withAuthAdmin";

function Layout({ children }) {
  return (
    <>
      <div className="pb-8">{children}</div>
    </>
  );
}

export default withAuthAdmin(Layout);

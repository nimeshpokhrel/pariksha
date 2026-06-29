"use client";

import ForgotPassword from "@/components/ForgotPassword";

import { Suspense } from "react";

export default function page() {
  return (
    <Suspense>
      <ForgotPassword />
    </Suspense>
  );
}

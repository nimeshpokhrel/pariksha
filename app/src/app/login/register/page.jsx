"use client";

import SignupForm from "@/components/SignupForm";

import { Suspense } from "react";

export default function page() {
  return (
    <Suspense>
      <SignupForm />
    </Suspense>
  );
}

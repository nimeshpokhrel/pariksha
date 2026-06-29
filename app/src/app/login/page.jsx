"use client";

import LoginForm from "@/components/LoginForm";
import { Suspense } from "react";

export default function page() {
  return (
    <>
      <Suspense>
        <LoginForm />
      </Suspense>
    </>
  );
}

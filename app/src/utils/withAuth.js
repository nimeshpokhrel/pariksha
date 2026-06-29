"use client";
import { useEffect } from "react";

import { useRouter, usePathname } from "next/navigation";
import isUserAuthenticated from "./isUserAuthenticated";
import { useAuth } from "./AuthContext";
import Spinner from "./Spinner";

export default function withAuth(WrappedComponent) {
  return function WithAuth(props) {
    const { user } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    const {
      data: session,
      isPending: loading,
      isError: error,
    } = isUserAuthenticated();

    useEffect(() => {
      if (error) {
        router.push(`/login?redirect=${pathname}`);
      }
    }, [session, router, loading, error]);

    if (loading) {
      return <Spinner />;
    }

    if (session && user) {
      return <WrappedComponent {...props} />;
    }
  };
}

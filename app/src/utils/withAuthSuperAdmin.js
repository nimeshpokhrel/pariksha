"use client";
import { useEffect } from "react";

import { useRouter, usePathname } from "next/navigation";
import isUserAuthenticated from "./isUserAuthenticated";
import { useAuth } from "./AuthContext";
import useToast from "./useToast";
import Spinner from "./Spinner";

export default function withAuthSuperAdmin(WrappedComponent) {
  return function WithAuth(props) {
    const { user } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    const { showToastError } = useToast();

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
      if (user.userType === "SuperAdmin") {
        return <WrappedComponent {...props} />;
      } else {
        showToastError({
          error: {
            response: {
              statusText: "Unauthorized",
              data: { detail: "You are not authorized to access this page" },
            },
          },
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        router.push(`/`);
      }
    }
  };
}

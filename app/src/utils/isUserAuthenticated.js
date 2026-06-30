"use client";

import { useQuery } from "@tanstack/react-query";
import { getCurrentUser } from "@/hooks/auth";

export default function IsUserAuthenticated() {
  return useQuery({
    queryKey: ["current-user"],
    queryFn: getCurrentUser,
    retry: false,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

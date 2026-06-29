"use client";

import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import { ChakraProvider } from "@chakra-ui/react";
import { AuthProvider } from "./AuthContext";
import { AdProvider } from "./AdContext";
// import { PwaInstallProvider } from "./PwaInstallContext";

export function Providers({ children }) {
  const [queryClient] = React.useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // With SSR, we usually want to set some default staleTime
            // above 0 to avoid refetching immediately on the client
            staleTime: 60 * 1000,
          },
        },
      })
  );
  return (
    <ChakraProvider>
      <QueryClientProvider client={queryClient}>
        <AdProvider>
          <AuthProvider>
            {/* <PwaInstallProvider> */}
              {/* <ReactQueryDevtools /> */}
              {children}
            {/* </PwaInstallProvider> */}
          </AuthProvider>
        </AdProvider>
      </QueryClientProvider>
    </ChakraProvider>
  );
}

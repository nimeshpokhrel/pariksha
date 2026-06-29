// pages/_app.tsx
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { NextPage } from "next";
import { ReactElement, ReactNode } from "react";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import MainLayout from "@/components/layouts/MainLayout";
import { GoogleAnalytics } from "@next/third-parties/google";
import { Toaster } from "@/components/ui/toaster";
import Head from "next/head";
// import ResultModal from "@/components/ResultModal";

export type NextPageWithLayout<P = object> = NextPage<P> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

export default function App({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout || ((page) => page);

  return (
    <>
      <Head>
        <title>
          Pariksha - Free Entrance Preparation for CSIT, BIT, BCA, CMAT |
          Explore Colleges & Universities in Nepal
        </title>
        <meta
          name="description"
          content="Pariksha offers free entrance preparation for CSIT, BIT, BCA, and CMAT in Nepal. Discover top universities, colleges, and degree programs, and access mock tests, study materials, and other resources."
        />
        <meta
          name="keywords"
          content="Pariksha, free entrance preparation Nepal, CSIT entrance, BIT entrance, BCA entrance, CMAT preparation, mock tests Nepal, study materials, degree programs Nepal, educational portal, test prep Nepal"
        />
        <link rel="canonical" href="https://pariksha.solutions/" />

        <meta
          property="og:title"
          content="Pariksha - Free Entrance Preparation for CSIT, BIT, BCA, CMAT | Explore Colleges & Universities in Nepal"
        />
        <meta
          property="og:description"
          content="Get free entrance preparation for CSIT, BIT, BCA, and CMAT in Nepal. Access mock tests, study materials, and find top colleges and universities with Pariksha."
        />
        <meta
          property="og:image"
          content="https://pariksha.solutions/og.jpeg"
        />
        <meta property="og:url" content="https://pariksha.solutions/" />
        <meta property="og:type" content="website" />
      </Head>

      <QueryClientProvider
        client={
          new QueryClient({
            defaultOptions: {
              queries: {
                staleTime: 60 * 1000,
              },
            },
          })
        }
      >
        <MainLayout>
          {getLayout(<Component {...pageProps} />)}
          <GoogleAnalytics gaId="G-3C5T6PFDV7" />
          <Toaster />
          {/* <ResultModal /> */}
        </MainLayout>
      </QueryClientProvider>
    </>
  );
}

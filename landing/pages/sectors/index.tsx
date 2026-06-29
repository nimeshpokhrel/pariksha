import Head from "next/head";
import { useState } from "react";
import { apiUrl } from "@/lib/config";
import { SearchBar } from "@/components/SearchBar";
import { SectorCard } from "@/components/SectorCard";
import { SectorCardType } from "@/types/types";

export default function SectorPage({ sectors }: { sectors: SectorCardType[] }) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredSectors = sectors.filter((sector) =>
    sector.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const pageTitle = searchQuery
    ? `Sectors matching "${searchQuery}" - Pariksha`
    : "Discover Sectors - Pariksha";

  const pageDescription = searchQuery
    ? `Browse sectors that match "${searchQuery}" in Nepal.`
    : "Explore all sectors available on Pariksha to find the right path for you.";

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
      </Head>

      <div className="min-h-screen bg-slate-50">
        <div className="container mx-auto px-4 py-8 md:px-6">
          <div className="mb-8 space-y-4 text-center">
            <h1 className="text-4xl font-bold tracking-tight">
              Discover Sectors
            </h1>
          </div>

          <div className="mx-auto mb-12 max-w-2xl">
            <SearchBar
              onSearch={setSearchQuery}
              placeholder="Search by sector name..."
            />
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filteredSectors.map((sector) => (
              <SectorCard key={sector._id} {...sector} />
            ))}
          </div>

          {filteredSectors.length === 0 && (
            <div className="py-12 text-center">
              <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                <svg
                  className="h-8 w-8 text-muted-foreground"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold">No sectors found</h3>
              <p className="mt-2 text-muted-foreground">
                Try adjusting your search to find what you're looking for.
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export async function getStaticProps() {
  const res = await fetch(`${apiUrl}/sector/getAllSectors`);
  if (!res.ok) throw new Error("Failed to fetch universities");
  const sectors = await res.json();
  return {
    props: {
      sectors: sectors.data,
    },
  };
}

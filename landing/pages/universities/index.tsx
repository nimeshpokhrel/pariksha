import { useState } from "react";
import { apiUrl } from "@/lib/config";
import { SearchBar } from "@/components/SearchBar";
import { UniversityCard } from "@/components/UniversityCard";
import { UniversityCardType } from "@/types/types";

export default function UniversityPage({
  universities,
}: {
  universities: UniversityCardType[];
}) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredUniversities = universities.filter(
    (university) =>
      university.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      university.location.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto px-4 py-8 md:px-6">
        <div className="mb-8 space-y-4 text-center">
          <h1 className="text-4xl font-bold tracking-tight">
            Discover Universities
          </h1>
          {/* <p className="mx-auto max-w-2xl text-muted-foreground">
            Explore top universities worldwide. Find detailed information about
            student populations, campus locations, and institution types.
          </p> */}
        </div>

        <div className="mx-auto mb-12 max-w-2xl">
          <SearchBar
            onSearch={setSearchQuery}
            placeholder="Search by university name or location..."
          />
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredUniversities.map((university) => (
            <UniversityCard key={university._id} {...university} />
          ))}
        </div>

        {filteredUniversities.length === 0 && (
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
            <h3 className="text-lg font-semibold">No universities found</h3>
            <p className="mt-2 text-muted-foreground">
              Try adjusting your search to find what youre looking for.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export async function getStaticProps() {
  const res = await fetch(`${apiUrl}/university/getAllUniversities`);
  if (!res.ok) throw new Error("Failed to fetch universities");
  const universities = await res.json();
  return {
    props: {
      universities: universities.data,
    },
  };
}

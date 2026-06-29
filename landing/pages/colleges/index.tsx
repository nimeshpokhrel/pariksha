import { useState } from "react";
import { apiUrl } from "@/lib/config";
import { SearchBar } from "@/components/SearchBar";
import { CollegeCard } from "@/components/CollegeCard";
import { CollegeCardType } from "@/types/types";
import { AeccCard } from "@/components/AeccCard";

export default function CollegesPage({
  colleges,
}: {
  colleges: CollegeCardType[];
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const filteredColleges = colleges.filter(
    (college) =>
      college.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      college.location.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto px-4 py-8 md:px-6">
        <div className="mb-8 space-y-4 text-center">
          <h1 className="text-4xl font-bold tracking-tight">
            Discover Colleges
          </h1>
        </div>

        <div className="mx-auto mb-12 max-w-2xl">
          <SearchBar
            onSearch={setSearchQuery}
            placeholder="Search For Colleges"
          />
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredColleges.map((college, index) => (
            <div key={college._id + index}>
              {college.name === "AECC Global" ? (
                <AeccCard />
              ) : (
                <CollegeCard {...college} />
              )}
            </div>
          ))}
        </div>

        {filteredColleges.length === 0 && (
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
            <h3 className="text-lg font-semibold">No colleges found</h3>
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
  const res = await fetch(`${apiUrl}/college/getAllColleges`);
  if (!res.ok) throw new Error("Failed to fetch colleges");
  const colleges = await res.json();
  const displayData = [
    ...colleges.data.slice(0, 3),
    {
      name: "AECC Global",
      link: "/colleges/aecc",
      location: "Dillibazar, Kathmandu",
    },
    ...colleges.data.slice(3),
  ];
  return {
    props: {
      colleges: [...displayData],
    },
  };
}

"use client";

import Link from "next/link";
import type { SearchResult } from "@/types/types";
import { Badge } from "@/components/ui/badge";

interface SearchResultsProps {
  results: SearchResult[];
  query: string;
  onResultClick: () => void;
}

export function SearchResults({
  results,
  query,
  onResultClick,
}: SearchResultsProps) {
  if (query.length < 2) {
    return null;
  }

  const getCategorySlug = (category: string) => {
    switch (category) {
      case "University":
        return "universities";
      case "Degree":
        return "degrees";
      case "College":
        return "colleges";
      case "Sector":
        return "sectors";
    }
  };

  return (
    <div className="absolute bottom-full left-0 right-0 z-50 mb-2 max-h-[30vh] overflow-y-auto rounded-lg border border-gray-300 bg-white shadow-lg">
      {results.length === 0 ? (
        <div className="p-4 text-center text-muted-foreground">
          No results found for {query}
        </div>
      ) : (
        <ul className="divide-y divide-gray-300 py-2">
          {results.map((result) => (
            <li key={`${result._id}`}>
              <Link
                href={`${getCategorySlug(result.category)}/${result.link}`}
                className="flex items-start p-4 transition-colors hover:bg-gray-50"
                onClick={onResultClick}
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-gray-900">
                    {result.name}
                  </p>
                </div>
                <Badge
                  variant="outline"
                  className={`ml-3 flex-shrink-0 ${getCategoryColor(result.category)}`}
                >
                  {result.category}
                </Badge>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// Helper function to get category-specific colors
function getCategoryColor(category: string): string {
  switch (category) {
    case "University":
      return "bg-blue-50 text-blue-700 border-blue-200";
    case "Sector":
      return "bg-green-50 text-green-700 border-green-200";
    case "Degree":
      return "bg-purple-50 text-purple-700 border-purple-200";
    case "College":
      return "bg-amber-50 text-amber-700 border-amber-200";
    default:
      return "bg-gray-50 text-gray-700 border-gray-200";
  }
}

"use client";

import type React from "react";

import { useState, useEffect, useRef } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { SearchResult, SearchCategory } from "@/types/types";
import { SearchResults } from "./SearchResults";
import { CategoryFilter } from "./CategoryFilter";

interface SearchBarProps {
  allData: SearchResult[];
}

export function SearchBar({ allData }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<"All" | SearchCategory>(
    "All",
  );
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Filter results based on query and active category
  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      return;
    }

    const lowerCaseQuery = query.toLowerCase();

    let filtered = allData.filter((item) =>
      item.name.toLowerCase().includes(lowerCaseQuery),
    );

    if (activeCategory !== "All") {
      filtered = filtered.filter((item) => item.category === activeCategory);
    }

    setResults(filtered);
  }, [query, activeCategory, allData]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setIsOpen(value.length >= 2);
  };

  // Clear search
  const clearSearch = () => {
    setQuery("");
    setResults([]);
    setIsOpen(false);
  };

  return (
    <div className="relative mx-auto w-full" ref={searchRef}>
      {/* Search Results - Now positioned ABOVE the search input */}
      {isOpen && (
        <SearchResults
          results={results}
          query={query}
          onResultClick={() => setIsOpen(false)}
        />
      )}

      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-6 top-1/2 h-4 w-4 -translate-y-1/2 transform text-white/80" />
        <Input
          type="text"
          placeholder="Search universities, sectors, degrees, colleges..."
          className="search-input w-full rounded-xl border-2 border-gray-200 py-6 pl-14 pr-10 placeholder:text-white/90 focus:border-primary focus:ring-0 focus:ring-offset-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
          value={query}
          onChange={handleInputChange}
          onFocus={() => query.length >= 2 && setIsOpen(true)}
        />
        {query && (
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-3 top-1/2 h-8 w-8 -translate-y-1/2 transform rounded-full p-0"
            onClick={clearSearch}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Clear search</span>
          </Button>
        )}
      </div>
      <CategoryFilter
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
      />
    </div>
  );
}

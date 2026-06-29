"use client";

import { Button } from "@/components/ui/button";
import type { SearchCategory } from "@/types/types";

interface CategoryFilterProps {
  activeCategory: "All" | SearchCategory;
  setActiveCategory: (category: "All" | SearchCategory) => void;
}

export function CategoryFilter({
  activeCategory,
  setActiveCategory,
}: CategoryFilterProps) {
  const categories: ("All" | SearchCategory)[] = [
    "All",
    "University",
    "Sector",
    "Degree",
    "College",
  ];

  return (
    <div className="mt-4 flex flex-wrap justify-center gap-2">
      {categories.map((category) => (
        <Button
          key={category}
          variant={activeCategory === category ? "default" : "outline"}
          size="sm"
          className={`rounded-full ${activeCategory !== category ? "bg-transparent" : ""} hover:border-transparent hover:bg-primary-70 hover:text-white`}
          onClick={() => setActiveCategory(category)}
        >
          {category}
        </Button>
      ))}
    </div>
  );
}

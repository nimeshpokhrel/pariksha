import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export function SearchBar({ onSearch, placeholder }) {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 transform text-muted-foreground" />
      <Input
        type="text"
        placeholder={placeholder || "Search..."}
        onChange={(e) => onSearch(e.target.value)}
        className="h-12 rounded-lg border-gray-400 bg-white pl-10 text-base focus:border-primary focus:ring-primary"
      />
    </div>
  );
}

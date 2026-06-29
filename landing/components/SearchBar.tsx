import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

export function SearchBar({ onSearch, placeholder }: SearchBarProps) {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 transform text-muted-foreground" />
      <Input
        type="text"
        placeholder={placeholder || "Search..."}
        onChange={(e) => onSearch(e.target.value)}
        className="h-12 rounded-full bg-white pl-10 text-base"
      />
    </div>
  );
}

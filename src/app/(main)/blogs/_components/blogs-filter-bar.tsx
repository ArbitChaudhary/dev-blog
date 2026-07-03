"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDebounce } from "@/hooks/use-debounce"; // Will need to check if this exists or implement inside

const CATEGORIES = ["All Categories", "Technology", "Design", "Lifestyle"];
const SORTS = [
  { label: "Latest", value: "latest" },
  { label: "Most Popular", value: "popular" },
  { label: "Oldest", value: "oldest" },
];

export function BlogsFilterBar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchParams.get("q") || "");
  const [category, setCategory] = useState(
    searchParams.get("category") || "All Categories",
  );
  const [sort, setSort] = useState(searchParams.get("sort") || "latest");

  // Handle immediate URL update for Select inputs
  const handleCategoryChange = (value: string) => {
    setCategory(value);
    updateUrl("category", value === "All Categories" ? "" : value);
  };

  const handleSortChange = (value: string) => {
    setSort(value);
    updateUrl("sort", value);
  };

  const updateUrl = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  // Debounced search handling
  useEffect(() => {
    const timer = setTimeout(() => {
      const params = new URLSearchParams(searchParams);
      if (search) {
        params.set("q", search);
      } else {
        params.delete("q");
      }
      // Only push if the search query actually changed in URL to prevent infinite loops
      if (
        searchParams.get("q") !== search &&
        (search !== "" || searchParams.has("q"))
      ) {
        router.push(`${pathname}?${params.toString()}`);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [search, pathname, router, searchParams]);

  return (
    <div className="flex flex-col md:flex-row gap-4 mb-8">
      {/* Search Box */}
      <div className="relative flex-1">
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-muted-foreground" />
        </div>
        <Input
          type="text"
          placeholder="Search articles..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10 h-10"
        />
      </div>

      {/* category and sort wrappers */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Category Filter */}
        <div className="w-full sm:w-[180px]">
          <Select value={category} onValueChange={handleCategoryChange}>
            <SelectTrigger className="h-10">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Sort Order */}
        <div className="w-full sm:w-[160px]">
          <Select value={sort} onValueChange={handleSortChange}>
            <SelectTrigger className="h-10">
              <SelectValue placeholder="Sort By" />
            </SelectTrigger>
            <SelectContent>
              {SORTS.map((s) => (
                <SelectItem key={s.value} value={s.value}>
                  {s.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}

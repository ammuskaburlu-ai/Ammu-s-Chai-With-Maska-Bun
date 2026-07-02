"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import type { Category } from "@/types/database";

interface MenuFiltersProps {
  categories: Category[];
  currentCategory?: string;
  currentSort?: string;
  currentSearch?: string;
}

export function MenuFilters({
  categories,
  currentCategory,
  currentSort,
  currentSearch,
}: MenuFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(currentSearch || "");

  useEffect(() => {
    setSearch(currentSearch || "");
  }, [currentSearch]);

  const updateParams = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/menu?${params.toString()}`);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = search.trim();
    updateParams("search", trimmed || null);
  };

  const clearSearch = () => {
    setSearch("");
    updateParams("search", null);
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search menu..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button type="submit" variant="brand">Search</Button>
        {currentSearch && (
          <Button type="button" variant="outline" onClick={clearSearch}>
            Clear
          </Button>
        )}
      </form>

      <div className="flex flex-wrap gap-2">
        <Button
          variant={!currentCategory ? "brand" : "outline"}
          size="sm"
          onClick={() => updateParams("category", null)}
        >
          All
        </Button>
        {categories.map((cat) => (
          <Button
            key={cat.id}
            variant={currentCategory === cat.slug ? "brand" : "outline"}
            size="sm"
            onClick={() => updateParams("category", cat.slug)}
          >
            {cat.name}
          </Button>
        ))}
      </div>

      <Select
        value={currentSort || "default"}
        onValueChange={(v) => updateParams("sort", v === "default" ? null : v)}
      >
        <SelectTrigger className={cn("w-full sm:w-48")}>
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="default">Default</SelectItem>
          <SelectItem value="popular">Popular</SelectItem>
          <SelectItem value="price-low">Price: Low to High</SelectItem>
          <SelectItem value="price-high">Price: High to Low</SelectItem>
          <SelectItem value="rating">Highest Rated</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}

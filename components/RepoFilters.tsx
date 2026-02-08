"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState, useEffect } from "react";
import { useDebounce } from "use-debounce";

interface RepoFiltersProps {
  collections: string[];
}

export default function RepoFilters({ collections }: RepoFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Initial states from URL
  const initialSearch = searchParams.get("q") || "";
  const initialStatus = searchParams.get("status") || "all";
  const initialCollection = searchParams.get("collection") || "all";

  const [search, setSearch] = useState(initialSearch);
  const [status, setStatus] = useState(initialStatus);
  const [collection, setCollection] = useState(initialCollection);

  // Debounce for search (300ms)
  const [debouncedSearch] = useDebounce(search, 300);

  // Effect to update URL
  useEffect(() => {
    const params = new URLSearchParams(searchParams);

    // Search
    if (debouncedSearch) params.set("q", debouncedSearch);
    else params.delete("q");

    // Status
    if (status && status !== "all") params.set("status", status);
    else params.delete("status");

    // Collection
    if (collection && collection !== "all") params.set("collection", collection);
    else params.delete("collection");

    // Keep repoId
    const repo = searchParams.get("repo");
    if (repo) params.set("repo", repo);

    const newQueryString = params.toString();
    const currentQueryString = searchParams.toString();

    if (newQueryString !== currentQueryString) {
      router.replace(`?${newQueryString}`);
    }
  }, [debouncedSearch, status, collection, router, searchParams]);

  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      {/* Search Bar */}
      <div className="flex-1 relative">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <input
          type="text"
          placeholder="Search posts..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-background border border-input rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all text-sm"
        />
      </div>

      {/* Selectors */}
      <div className="flex gap-4">
        {/* Collection Filter */}
        <select
          value={collection}
          onChange={(e) => setCollection(e.target.value)}
          className="px-3 py-2 bg-background border border-input rounded-md text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring cursor-pointer"
        >
          <option value="all">All collections</option>
          {collections.map((col) => (
            <option key={col} value={col}>
              {col}
            </option>
          ))}
        </select>

        {/* Status Filter */}
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="px-3 py-2 bg-background border border-input rounded-md text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring cursor-pointer"
        >
          <option value="all">All statuses</option>
          <option value="synced">Synced</option>
          <option value="modified">Modified</option>
          <option value="draft">Drafts</option>
        </select>
      </div>
    </div>
  );
}

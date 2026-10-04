"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { CloseIcon, SearchIcon } from "@/components/icons";

const SearchResults = dynamic(
  () => import("@/components/layout/SearchResults").then((m) => m.SearchResults),
  { ssr: false }
);

export function SearchDropdown() {
  const [query, setQuery] = useState("");
  const showDropdown = query.trim().length > 0;

  function close() {
    setQuery("");
  }

  return (
    <div className="relative hidden w-[clamp(320px,124.57px+25.45vw,491px)] shrink-0 md:block">
      {/* Search */}
      <div className="h-6xl gap-sm px-xl py-md flex w-full items-center rounded-full border border-neutral-900 bg-neutral-950">
        <SearchIcon className="size-5 shrink-0" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Escape" && close()}
          aria-label="Search"
          placeholder="Search "
          className="tracking-t-2 text-neutral-25 min-w-px flex-1 bg-transparent text-sm outline-none placeholder:text-neutral-600"
        />
        {query.length > 0 && (
          <button type="button" onClick={close} aria-label="Clear search">
            <CloseIcon className="size-4 shrink-0" />
          </button>
        )}
      </div>

      {/* Dropdown */}
      {showDropdown && <SearchResults query={query} onClose={close} />}
    </div>
  );
}

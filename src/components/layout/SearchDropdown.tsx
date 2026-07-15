"use client";

import Link from "next/link";
import { useState } from "react";
import { CloseIcon, SearchIcon } from "@/components/icons";
import { InfiniteScrollSentinel } from "@/components/common/InfiniteScrollSentinel";
import { UserAvatar } from "@/components/user/UserAvatar";
import { useDebouncedValue } from "@/hooks/common/useDebouncedValue";
import { useUserSearch } from "@/hooks/user/useUserSearch";
import { flattenPages } from "@/lib/pagination";

export function SearchDropdown() {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebouncedValue(query, 400);
  const { data, isFetching, isFetchingNextPage, hasNextPage, fetchNextPage } =
    useUserSearch(debouncedQuery);

  const hasQuery = debouncedQuery.trim().length > 0;
  const users = flattenPages(data?.pages, (page) => page.users);
  const isFetchingQuery = isFetching && !isFetchingNextPage;
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

      {showDropdown && (
        <>
          <button
            type="button"
            aria-label="Close search results"
            className="fixed inset-0 z-40 cursor-default"
            onClick={close}
          />
          <div className="gap-xl p-2xl absolute top-full left-0 z-50 flex max-h-100 w-full scrollbar-none flex-col items-start overflow-y-auto rounded-3xl border border-neutral-900 bg-neutral-950">
            {hasQuery && !isFetchingQuery && users.length === 0 && (
              <div className="gap-xs flex w-full flex-col items-center text-center">
                <p className="text-md tracking-t-2 text-neutral-25 font-bold">No results found</p>
                <p className="tracking-t-2 text-sm text-neutral-400">Change your keyword</p>
              </div>
            )}
            {users.map((user) => (
              <Link
                key={user.id}
                href={`/profile/${user.username}`}
                onClick={close}
                className="gap-md flex w-full items-center"
              >
                <UserAvatar src={user.avatarUrl} alt={user.name} className="size-12" />
                <div className="flex min-w-px flex-1 flex-col items-start justify-center text-sm">
                  <p className="tracking-t-1 text-neutral-25 w-full font-bold">{user.name}</p>
                  <p className="tracking-t-2 w-full text-neutral-400">{user.username}</p>
                </div>
              </Link>
            ))}
            {hasQuery && !isFetchingQuery && users.length > 0 && (
              <InfiniteScrollSentinel
                onIntersect={() => fetchNextPage()}
                enabled={!!hasNextPage && !isFetchingNextPage}
              />
            )}
          </div>
        </>
      )}
    </div>
  );
}

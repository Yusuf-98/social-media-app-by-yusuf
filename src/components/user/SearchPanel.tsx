"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { CloseIcon, SearchIcon } from "@/components/icons";
import { EmptyState } from "@/components/common/EmptyState";
import { ErrorState } from "@/components/common/ErrorState";
import { InfiniteScrollSentinel } from "@/components/common/InfiniteScrollSentinel";
import { UserRow } from "@/components/user/UserRow";
import { UserRowSkeleton } from "@/components/user/UserRowSkeleton";
import { useDebouncedValue } from "@/hooks/common/useDebouncedValue";
import { useUserSearch } from "@/hooks/user/useUserSearch";
import { flattenPages } from "@/lib/pagination";

export function SearchPanel() {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebouncedValue(query, 400);
  const {
    data,
    isLoading,
    isError,
    isFetching,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    refetch,
  } = useUserSearch(debouncedQuery);
  const router = useRouter();

  const users = flattenPages(data?.pages, (page) => page.users);
  const hasQuery = debouncedQuery.trim().length > 0;
  const isFetchingQuery = isFetching && !isFetchingNextPage;

  return (
    <div className="flex w-full flex-col items-start">
      {/* Header */}
      <div className="h-7xl gap-xl bg-base-black px-xl flex w-full shrink-0 items-center border-b border-neutral-900">
        {/* Search */}
        <div className="h-5xl gap-sm px-lg py-md flex flex-1 items-center rounded-full border border-neutral-900 bg-neutral-950">
          <SearchIcon className="size-5 shrink-0" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search"
            placeholder="Search"
            className="tracking-t-2 text-neutral-25 min-w-px flex-1 bg-transparent text-sm outline-none placeholder:text-neutral-600"
            autoFocus
          />
        </div>
        <button type="button" onClick={() => router.back()} aria-label="Close search">
          <CloseIcon className="size-6 shrink-0" />
        </button>
      </div>

      {/* Results */}
      <div className="custom-container gap-xl py-xl mx-auto flex w-full flex-col items-start">
        {!hasQuery && (
          <EmptyState
            title="Search for people"
            description="Type a name or username to get started."
          />
        )}
        {hasQuery && (isLoading || isFetchingQuery) && (
          <>
            <UserRowSkeleton />
            <UserRowSkeleton />
            <UserRowSkeleton />
          </>
        )}
        {hasQuery && isError && <ErrorState onRetry={() => refetch()} />}
        {hasQuery && !isLoading && !isFetchingQuery && !isError && users.length === 0 && (
          <div className="gap-xs py-11xl flex w-full flex-col items-center text-center">
            <p className="text-md tracking-t-2 text-neutral-25 font-bold">No results found</p>
            <p className="tracking-t-2 text-sm text-neutral-400">Change your keyword</p>
          </div>
        )}
        {hasQuery &&
          !isLoading &&
          !isFetchingQuery &&
          users.map((user) => <UserRow key={user.id} user={user} showFollowButton />)}
        {hasQuery && !isLoading && !isFetchingQuery && !isError && (
          <InfiniteScrollSentinel
            onIntersect={() => fetchNextPage()}
            enabled={!!hasNextPage && !isFetchingNextPage}
          />
        )}
      </div>
    </div>
  );
}

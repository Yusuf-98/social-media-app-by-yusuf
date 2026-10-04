"use client";

import Link from "next/link";
import { InfiniteScrollSentinel } from "@/components/common/InfiniteScrollSentinel";
import { UserAvatar } from "@/components/user/UserAvatar";
import { useDebouncedValue } from "@/hooks/common/useDebouncedValue";
import { useUserSearch } from "@/hooks/user/useUserSearch";
import { flattenPages } from "@/lib/pagination";

interface SearchResultsProps {
  query: string;
  onClose: () => void;
}

export function SearchResults({ query, onClose }: SearchResultsProps) {
  const debouncedQuery = useDebouncedValue(query, 400);
  const { data, isFetching, isFetchingNextPage, hasNextPage, fetchNextPage } =
    useUserSearch(debouncedQuery);

  const hasQuery = debouncedQuery.trim().length > 0;
  const users = flattenPages(data?.pages, (page) => page.users);
  const isFetchingQuery = isFetching && !isFetchingNextPage;

  return (
    <>
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Close search results"
        className="fixed inset-0 z-40 cursor-default"
        onClick={onClose}
      />

      {/* Results */}
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
            onClick={onClose}
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
  );
}

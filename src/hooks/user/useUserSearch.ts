"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { searchUsers } from "@/lib/api/users";

export function useUserSearch(query: string) {
  return useInfiniteQuery({
    queryKey: ["users", "search", query],
    queryFn: ({ pageParam }: { pageParam: number }) =>
      searchUsers(query, { page: pageParam, limit: 20 }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.pagination.page < lastPage.pagination.totalPages
        ? lastPage.pagination.page + 1
        : undefined,
    enabled: query.trim().length > 0,
  });
}

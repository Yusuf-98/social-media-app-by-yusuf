"use client";

import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { getFeed } from "@/lib/api/feed";
import { applyLikeSaveCrossCheckList } from "@/lib/likeSaveCrossCheck";

export function useFeed(enabled = true) {
  const queryClient = useQueryClient();

  return useInfiniteQuery({
    queryKey: ["feed"],
    queryFn: async ({ pageParam }: { pageParam: number }) => {
      const data = await getFeed({ page: pageParam, limit: 10 });
      return { ...data, posts: applyLikeSaveCrossCheckList(queryClient, data.posts) };
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.pagination.page < lastPage.pagination.totalPages
        ? lastPage.pagination.page + 1
        : undefined,
    enabled,
  });
}

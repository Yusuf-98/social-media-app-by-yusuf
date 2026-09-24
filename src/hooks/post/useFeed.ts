"use client";

import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { getFeed } from "@/lib/api/feed";
import { applyLikeSaveCrossCheckList } from "@/lib/likeSaveCrossCheck";
import { FEED_PAGE_SIZE } from "@/lib/pagination";
import { qk } from "@/lib/queryKeys";

export function useFeed(enabled = true) {
  const queryClient = useQueryClient();

  return useInfiniteQuery({
    queryKey: qk.feed(),
    queryFn: async ({ pageParam }: { pageParam: number }) => {
      const data = await getFeed({ page: pageParam, limit: FEED_PAGE_SIZE });
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

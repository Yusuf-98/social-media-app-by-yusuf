"use client";

import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { getExplorePosts } from "@/lib/api/posts";
import { applyLikeSaveCrossCheckList } from "@/lib/likeSaveCrossCheck";
import { FEED_PAGE_SIZE } from "@/lib/pagination";
import { qk } from "@/lib/queryKeys";

export function useExplorePosts(enabled = true) {
  const queryClient = useQueryClient();

  return useInfiniteQuery({
    queryKey: qk.explorePosts(),
    queryFn: async ({ pageParam }: { pageParam: number }) => {
      const data = await getExplorePosts({ page: pageParam, limit: FEED_PAGE_SIZE });
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

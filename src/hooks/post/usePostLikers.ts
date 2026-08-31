"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { getPostLikes } from "@/lib/api/likes";
import { qk } from "@/lib/queryKeys";

export function usePostLikers(postId: number, enabled: boolean) {
  return useInfiniteQuery({
    queryKey: qk.postLikers(postId),
    queryFn: ({ pageParam }: { pageParam: number }) =>
      getPostLikes(postId, { page: pageParam, limit: 20 }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.pagination.page < lastPage.pagination.totalPages
        ? lastPage.pagination.page + 1
        : undefined,
    enabled,
  });
}

"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { getMyFollowers, getMyFollowing } from "@/lib/api/follow";
import { getUserFollowers, getUserFollowing } from "@/lib/api/users";

interface UseFollowListParams {
  type: "followers" | "following";
  username?: string;
}

export function useFollowList({ type, username }: UseFollowListParams) {
  return useInfiniteQuery({
    queryKey: username ? ["users", username, type] : ["me", type],
    queryFn: ({ pageParam }: { pageParam: number }) =>
      username
        ? type === "followers"
          ? getUserFollowers(username, { page: pageParam, limit: 20 })
          : getUserFollowing(username, { page: pageParam, limit: 20 })
        : type === "followers"
          ? getMyFollowers({ page: pageParam, limit: 20 })
          : getMyFollowing({ page: pageParam, limit: 20 }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.pagination.page < lastPage.pagination.totalPages
        ? lastPage.pagination.page + 1
        : undefined,
  });
}

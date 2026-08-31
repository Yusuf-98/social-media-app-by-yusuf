"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { getMyFollowers, getMyFollowing } from "@/lib/api/follow";
import { getUserFollowers, getUserFollowing } from "@/lib/api/users";
import { qk } from "@/lib/queryKeys";

interface UseFollowListParams {
  type: "followers" | "following";
  username?: string;
}

function followListKey({ type, username }: UseFollowListParams) {
  if (username) return type === "followers" ? qk.users.followers(username) : qk.users.following(username);
  return type === "followers" ? qk.me.followers() : qk.me.following();
}

export function useFollowList({ type, username }: UseFollowListParams) {
  return useInfiniteQuery({
    queryKey: followListKey({ type, username }),
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

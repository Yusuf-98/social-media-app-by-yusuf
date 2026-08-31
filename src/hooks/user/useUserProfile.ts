"use client";

import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { getPublicProfile, getUserLikes, getUserPosts } from "@/lib/api/users";
import { qk } from "@/lib/queryKeys";

function getNextPageParam(lastPage: { pagination: { page: number; totalPages: number } }) {
  return lastPage.pagination.page < lastPage.pagination.totalPages
    ? lastPage.pagination.page + 1
    : undefined;
}

export function useUserProfile(username: string) {
  return useQuery({
    queryKey: qk.users.profile(username),
    queryFn: () => getPublicProfile(username),
    enabled: !!username,
  });
}

export function useUserPosts(username: string) {
  return useInfiniteQuery({
    queryKey: qk.users.posts(username),
    queryFn: ({ pageParam }: { pageParam: number }) =>
      getUserPosts(username, { page: pageParam, limit: 20 }),
    initialPageParam: 1,
    getNextPageParam,
    enabled: !!username,
  });
}

export function useUserLikes(username: string) {
  return useInfiniteQuery({
    queryKey: qk.users.likes(username),
    queryFn: ({ pageParam }: { pageParam: number }) =>
      getUserLikes(username, { page: pageParam, limit: 20 }),
    initialPageParam: 1,
    getNextPageParam,
    enabled: !!username,
  });
}

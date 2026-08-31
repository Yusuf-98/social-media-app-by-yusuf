"use client";

import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getMe, getMyPosts, updateMe } from "@/lib/api/me";
import { getMyLikes } from "@/lib/api/likes";
import { getMySaved } from "@/lib/api/saves";
import { applyLikeSaveCrossCheckList } from "@/lib/likeSaveCrossCheck";
import { qk } from "@/lib/queryKeys";

export function useMe(enabled = true) {
  return useQuery({
    queryKey: qk.me.self(),
    queryFn: getMe,
    enabled,
  });
}

function getNextPageParam(lastPage: { pagination: { page: number; totalPages: number } }) {
  return lastPage.pagination.page < lastPage.pagination.totalPages
    ? lastPage.pagination.page + 1
    : undefined;
}

export function useMyPosts() {
  const queryClient = useQueryClient();

  return useInfiniteQuery({
    queryKey: qk.me.posts(),
    queryFn: async ({ pageParam }: { pageParam: number }) => {
      const data = await getMyPosts({ page: pageParam, limit: 20 });
      return { ...data, posts: applyLikeSaveCrossCheckList(queryClient, data.posts) };
    },
    initialPageParam: 1,
    getNextPageParam,
  });
}

export function useMySaved() {
  return useInfiniteQuery({
    queryKey: qk.me.saved(),
    queryFn: ({ pageParam }: { pageParam: number }) => getMySaved({ page: pageParam, limit: 20 }),
    initialPageParam: 1,
    getNextPageParam,
  });
}

export function useMyLikes() {
  return useInfiniteQuery({
    queryKey: qk.me.likes(),
    queryFn: ({ pageParam }: { pageParam: number }) => getMyLikes({ page: pageParam, limit: 20 }),
    initialPageParam: 1,
    getNextPageParam,
  });
}

export function useUpdateMe() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateMe,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: qk.me.self() });
    },
  });
}

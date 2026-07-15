"use client";

import type { InfiniteData } from "@tanstack/react-query";
import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/auth/useAuth";
import { addComment, deleteComment, getComments } from "@/lib/api/comments";
import { trackEvent } from "@/lib/analytics";
import { invalidatePostQueries } from "@/lib/queryKeys";
import type { Comment, Pagination } from "@/types/api";

type CommentsPage = { comments: Comment[]; pagination: Pagination };

export function useComments(postId: number) {
  return useInfiniteQuery({
    queryKey: ["comments", postId],
    queryFn: ({ pageParam }: { pageParam: number }) =>
      getComments(postId, { page: pageParam, limit: 20 }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.pagination.page < lastPage.pagination.totalPages
        ? lastPage.pagination.page + 1
        : undefined,
  });
}

export function useAddComment(postId: number) {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: (text: string) => {
      trackEvent("comment_submit", { postId });
      return addComment(postId, text);
    },
    onMutate: async (text: string) => {
      await queryClient.cancelQueries({ queryKey: ["comments", postId] });
      const previous = queryClient.getQueryData<InfiniteData<CommentsPage>>(["comments", postId]);
      const tempComment: Comment = {
        id: -Date.now(),
        text,
        createdAt: new Date().toISOString(),
        author: {
          id: user?.id ?? 0,
          username: user?.username ?? "",
          name: user?.name ?? "",
          avatarUrl: user?.avatarUrl ?? null,
        },
      };
      queryClient.setQueryData<InfiniteData<CommentsPage>>(["comments", postId], (old) => {
        if (!old) {
          // Synthesize first page (pre-fetch optimistic comment)
          return {
            pages: [
              {
                comments: [tempComment],
                pagination: { page: 1, limit: 20, total: 1, totalPages: 1 },
              },
            ],
            pageParams: [1],
          };
        }
        const pages = [...old.pages];
        const lastIdx = pages.length - 1;
        pages[lastIdx] = { ...pages[lastIdx], comments: [...pages[lastIdx].comments, tempComment] };
        return { ...old, pages };
      });
      return { previous };
    },
    onError: (_err, _text, context) => {
      if (context?.previous) queryClient.setQueryData(["comments", postId], context.previous);
    },
    onSuccess: () => {
      invalidatePostQueries(queryClient, postId);
    },
  });
}

export function useDeleteComment(postId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (commentId: number) => deleteComment(commentId),
    onMutate: async (commentId: number) => {
      await queryClient.cancelQueries({ queryKey: ["comments", postId] });
      const previous = queryClient.getQueryData<InfiniteData<CommentsPage>>(["comments", postId]);
      queryClient.setQueryData<InfiniteData<CommentsPage>>(["comments", postId], (old) => {
        if (!old) return old;
        return {
          ...old,
          pages: old.pages.map((page) => ({
            ...page,
            comments: page.comments.filter((c) => c.id !== commentId),
          })),
        };
      });
      return { previous };
    },
    onError: (_err, _commentId, context) => {
      if (context?.previous) queryClient.setQueryData(["comments", postId], context.previous);
    },
    onSuccess: () => {
      invalidatePostQueries(queryClient, postId);
    },
  });
}

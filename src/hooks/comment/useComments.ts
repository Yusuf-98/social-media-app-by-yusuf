"use client";

import type { InfiniteData } from "@tanstack/react-query";
import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/auth/useAuth";
import { addComment, deleteComment, getComments } from "@/lib/api/comments";
import { trackEvent } from "@/lib/analytics";
import { patchPost } from "@/lib/postCache";
import { isPostOrUserQuery, qk } from "@/lib/queryKeys";
import type { Comment, Pagination, Post } from "@/types/api";

type CommentsPage = { comments: Comment[]; pagination: Pagination };

export function useComments(postId: number) {
  return useInfiniteQuery({
    queryKey: qk.comments(postId),
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
      await queryClient.cancelQueries({ queryKey: qk.comments(postId) });
      await queryClient.cancelQueries({ predicate: isPostOrUserQuery });
      const previousComments = queryClient.getQueryData<InfiniteData<CommentsPage>>(
        qk.comments(postId)
      );
      const previousPosts = queryClient.getQueriesData({ predicate: isPostOrUserQuery });
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
      queryClient.setQueryData<InfiniteData<CommentsPage>>(qk.comments(postId), (old) => {
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
      const currentPost = queryClient.getQueryData<Post>(qk.post(postId));
      const nextCommentCount = Math.max(0, (currentPost?.commentCount ?? 0) + 1);
      queryClient.setQueriesData({ predicate: isPostOrUserQuery }, (old: unknown) =>
        patchPost(old, postId, { commentCount: nextCommentCount })
      );
      return { previousComments, previousPosts };
    },
    onError: (_err, _text, context) => {
      if (context?.previousComments) {
        queryClient.setQueryData(qk.comments(postId), context.previousComments);
      } else {
        queryClient.removeQueries({ queryKey: qk.comments(postId) });
      }
      context?.previousPosts.forEach(([key, data]) => queryClient.setQueryData(key, data));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: qk.comments(postId) });
    },
  });
}

export function useDeleteComment(postId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (commentId: number) => deleteComment(commentId),
    onMutate: async (commentId: number) => {
      await queryClient.cancelQueries({ queryKey: qk.comments(postId) });
      await queryClient.cancelQueries({ predicate: isPostOrUserQuery });
      const previousComments = queryClient.getQueryData<InfiniteData<CommentsPage>>(
        qk.comments(postId)
      );
      const previousPosts = queryClient.getQueriesData({ predicate: isPostOrUserQuery });
      queryClient.setQueryData<InfiniteData<CommentsPage>>(qk.comments(postId), (old) => {
        if (!old) return old;
        return {
          ...old,
          pages: old.pages.map((page) => ({
            ...page,
            comments: page.comments.filter((c) => c.id !== commentId),
          })),
        };
      });
      const currentPost = queryClient.getQueryData<Post>(qk.post(postId));
      const nextCommentCount = Math.max(0, (currentPost?.commentCount ?? 0) - 1);
      queryClient.setQueriesData({ predicate: isPostOrUserQuery }, (old: unknown) =>
        patchPost(old, postId, { commentCount: nextCommentCount })
      );
      return { previousComments, previousPosts };
    },
    onError: (_err, _commentId, context) => {
      if (context?.previousComments) {
        queryClient.setQueryData(qk.comments(postId), context.previousComments);
      } else {
        queryClient.removeQueries({ queryKey: qk.comments(postId) });
      }
      context?.previousPosts.forEach(([key, data]) => queryClient.setQueryData(key, data));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: qk.comments(postId) });
    },
  });
}

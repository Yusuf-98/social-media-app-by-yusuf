"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { likePost, unlikePost } from "@/lib/api/likes";
import { trackEvent } from "@/lib/analytics";
import { patchPost } from "@/lib/postCache";
import { invalidatePostQueries, isPostOrUserQuery } from "@/lib/queryKeys";
import type { Post } from "@/types/api";

export function useLikeToggle(post: Pick<Post, "id" | "likedByMe" | "likeCount">) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => {
      trackEvent(post.likedByMe ? "unlike" : "like", { postId: post.id });
      return post.likedByMe ? unlikePost(post.id) : likePost(post.id);
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ predicate: isPostOrUserQuery });
      const previous = queryClient.getQueriesData({ predicate: isPostOrUserQuery });
      const nextLiked = !post.likedByMe;
      const nextCount = post.likeCount + (nextLiked ? 1 : -1);
      queryClient.setQueriesData({ predicate: isPostOrUserQuery }, (old: unknown) =>
        patchPost(old, post.id, { likedByMe: nextLiked, likeCount: nextCount })
      );
      // Liked-post-ids sync
      queryClient.setQueryData<number[]>(["me", "likedPostIds"], (old = []) =>
        nextLiked ? [...new Set([...old, post.id])] : old.filter((id) => id !== post.id)
      );
      return { previous };
    },
    onError: (_err, _vars, context) => {
      context?.previous.forEach(([key, data]) => queryClient.setQueryData(key, data));
      // Resync on error only
      invalidatePostQueries(queryClient, post.id);
    },
  });
}

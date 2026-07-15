"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { savePost, unsavePost } from "@/lib/api/saves";
import { trackEvent } from "@/lib/analytics";
import { patchPost } from "@/lib/postCache";
import { invalidatePostQueries, isPostOrUserQuery } from "@/lib/queryKeys";
import type { Post } from "@/types/api";

export function useSaveToggle(post: Pick<Post, "id" | "savedByMe">) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => {
      trackEvent(post.savedByMe ? "unsave" : "save", { postId: post.id });
      return post.savedByMe ? unsavePost(post.id) : savePost(post.id);
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ predicate: isPostOrUserQuery });
      const previous = queryClient.getQueriesData({ predicate: isPostOrUserQuery });
      const nextSaved = !post.savedByMe;
      queryClient.setQueriesData({ predicate: isPostOrUserQuery }, (old: unknown) =>
        patchPost(old, post.id, { savedByMe: nextSaved })
      );
      // Saved-post-ids sync
      queryClient.setQueryData<number[]>(["me", "savedPostIds"], (old = []) =>
        nextSaved ? [...new Set([...old, post.id])] : old.filter((id) => id !== post.id)
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

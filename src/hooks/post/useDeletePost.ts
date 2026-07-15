"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deletePost } from "@/lib/api/posts";
import { invalidatePostQueries } from "@/lib/queryKeys";

export function useDeletePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deletePost(id),
    onSuccess: (_data, id) => {
      invalidatePostQueries(queryClient, id);
    },
  });
}

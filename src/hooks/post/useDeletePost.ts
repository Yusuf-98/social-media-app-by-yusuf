"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deletePost } from "@/lib/api/posts";
import { invalidateAllPostQueries, qk } from "@/lib/queryKeys";

export function useDeletePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deletePost(id),
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: qk.post(id) });
      invalidateAllPostQueries(queryClient);
    },
  });
}

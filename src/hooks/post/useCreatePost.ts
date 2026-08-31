"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createPost } from "@/lib/api/posts";
import { invalidateAllPostQueries } from "@/lib/queryKeys";

export function useCreatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData: FormData) => createPost(formData),
    onSuccess: () => {
      invalidateAllPostQueries(queryClient);
    },
  });
}

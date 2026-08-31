"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getPost } from "@/lib/api/posts";
import { applyLikeSaveCrossCheck } from "@/lib/likeSaveCrossCheck";
import { qk } from "@/lib/queryKeys";

export function usePost(id: number) {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: qk.post(id),
    queryFn: async () => {
      const post = await getPost(id);
      return applyLikeSaveCrossCheck(queryClient, post);
    },
  });
}

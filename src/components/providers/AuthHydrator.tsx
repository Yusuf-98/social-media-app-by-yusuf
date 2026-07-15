"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { getMyLikes } from "@/lib/api/likes";
import { getMySaved } from "@/lib/api/saves";
import { getStoredToken } from "@/lib/auth-storage";
import { invalidatePostQueries } from "@/lib/queryKeys";
import { setCredentials, setHydrated } from "@/store/authSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

export function AuthHydrator() {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const token = useAppSelector((s) => s.auth.token);

  // Hydrate from storage
  useEffect(() => {
    const storedToken = getStoredToken();
    if (storedToken) dispatch(setCredentials(storedToken));
    dispatch(setHydrated(true));
  }, [dispatch]);

  // Prefetch on token change
  useEffect(() => {
    if (!token) return;
    Promise.all([
      // Liked post ids
      queryClient.prefetchQuery({
        queryKey: ["me", "likedPostIds"],
        queryFn: async () => {
          const { posts } = await getMyLikes({ page: 1, limit: 50 });
          return posts.map((p) => p.id);
        },
      }),
      // Saved post ids
      queryClient.prefetchQuery({
        queryKey: ["me", "savedPostIds"],
        queryFn: async () => {
          const { posts } = await getMySaved({ page: 1, limit: 50 });
          return posts.map((p) => p.id);
        },
      }),
    ]).then(() => {
      // Reconcile stale cross-check
      invalidatePostQueries(queryClient);
    });
  }, [token, queryClient]);

  return null;
}

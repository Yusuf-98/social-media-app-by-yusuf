"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { getMyLikes } from "@/lib/api/likes";
import { getMySaved } from "@/lib/api/saves";
import { applyAuthToken, getStoredToken } from "@/lib/auth-storage";
import { fetchAllPostIds } from "@/lib/fetchAllPages";
import { invalidateAllPostQueries, qk } from "@/lib/queryKeys";
import { setHydrated } from "@/store/authSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

export function AuthHydrator() {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const token = useAppSelector((s) => s.auth.token);

  // Hydrate from storage
  useEffect(() => {
    const storedToken = getStoredToken();
    if (storedToken) applyAuthToken(storedToken, dispatch);
    dispatch(setHydrated(true));
  }, [dispatch]);

  // Prefetch on token change
  useEffect(() => {
    if (!token) return;
    Promise.all([
      // Liked post ids
      queryClient.prefetchQuery({
        queryKey: qk.me.likedIds(),
        queryFn: () => fetchAllPostIds(getMyLikes),
      }),
      // Saved post ids
      queryClient.prefetchQuery({
        queryKey: qk.me.savedIds(),
        queryFn: () => fetchAllPostIds(getMySaved),
      }),
    ]).then(() => {
      // Reconcile stale cross-check
      invalidateAllPostQueries(queryClient);
    });
  }, [token, queryClient]);

  return null;
}

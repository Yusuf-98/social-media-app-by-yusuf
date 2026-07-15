"use client";

import { useQuery } from "@tanstack/react-query";
import { getMe } from "@/lib/api/me";
import { useAppSelector } from "@/store/hooks";

export function useAuth() {
  const { token, hasHydrated } = useAppSelector((s) => s.auth);
  const isAuthenticated = hasHydrated && !!token;

  const meQuery = useQuery({
    queryKey: ["me"],
    queryFn: getMe,
    enabled: isAuthenticated,
  });

  return {
    isAuthenticated,
    hasHydrated,
    user: meQuery.data ?? null,
    isLoading: !hasHydrated || (isAuthenticated && meQuery.isLoading),
  };
}

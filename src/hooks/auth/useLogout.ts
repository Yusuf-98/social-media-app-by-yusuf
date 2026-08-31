"use client";

import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { clearAuthToken } from "@/lib/auth-storage";
import { useAppDispatch } from "@/store/hooks";

export function useLogout() {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const router = useRouter();

  return function handleLogout() {
    clearAuthToken(dispatch);
    queryClient.clear();
    router.push("/feed");
  };
}

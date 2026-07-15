"use client";

import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { clearStoredToken } from "@/lib/auth-storage";
import { logout } from "@/store/authSlice";
import { useAppDispatch } from "@/store/hooks";

export function useLogout() {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const router = useRouter();

  return function handleLogout() {
    clearStoredToken();
    dispatch(logout());
    queryClient.clear();
    router.push("/feed");
  };
}

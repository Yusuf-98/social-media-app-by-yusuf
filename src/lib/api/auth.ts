import { apiPost } from "./client";
import type { LoginResponse } from "@/types/api";

export interface RegisterPayload {
  name: string;
  username: string;
  email: string;
  phone?: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export function register(payload: RegisterPayload) {
  return apiPost<LoginResponse>("/api/auth/register", payload);
}

export function login(payload: LoginPayload) {
  return apiPost<LoginResponse>("/api/auth/login", payload);
}

import { setCredentials, logout } from "@/store/authSlice";
import type { AppDispatch } from "@/store/store";

const TOKEN_KEY = "sociality_token";

export function getStoredToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

function setStoredToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
  const secure = location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${TOKEN_KEY}=${token}; path=/; max-age=${60 * 60 * 24 * 30}; SameSite=Lax${secure}`;
}

function clearStoredToken() {
  localStorage.removeItem(TOKEN_KEY);
  document.cookie = `${TOKEN_KEY}=; path=/; max-age=0`;
}

export function applyAuthToken(token: string, dispatch: AppDispatch) {
  setStoredToken(token);
  dispatch(setCredentials(token));
}

export function clearAuthToken(dispatch: AppDispatch) {
  clearStoredToken();
  dispatch(logout());
}

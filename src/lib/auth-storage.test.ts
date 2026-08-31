import { beforeEach, describe, expect, it, vi } from "vitest";
import { applyAuthToken, clearAuthToken, getStoredToken } from "@/lib/auth-storage";
import { logout, setCredentials } from "@/store/authSlice";
import type { AppDispatch } from "@/store/store";

describe("auth-storage", () => {
  beforeEach(() => {
    localStorage.clear();
    document.cookie = "sociality_token=; path=/; max-age=0";
  });

  it("applyAuthToken writes localStorage, the cookie, and dispatches setCredentials", () => {
    const dispatch = vi.fn() as unknown as AppDispatch;
    applyAuthToken("abc123", dispatch);

    expect(getStoredToken()).toBe("abc123");
    expect(document.cookie).toContain("sociality_token=abc123");
    expect(dispatch).toHaveBeenCalledWith(setCredentials("abc123"));
  });

  it("clearAuthToken removes localStorage, expires the cookie, and dispatches logout", () => {
    const dispatch = vi.fn() as unknown as AppDispatch;
    applyAuthToken("abc123", dispatch);

    clearAuthToken(dispatch);

    expect(getStoredToken()).toBeNull();
    expect(document.cookie).not.toContain("sociality_token=abc123");
    expect(dispatch).toHaveBeenCalledWith(logout());
  });
});

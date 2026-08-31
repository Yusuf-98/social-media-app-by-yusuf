import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const { getStoredTokenMock } = vi.hoisted(() => ({ getStoredTokenMock: vi.fn() }));

vi.mock("@/lib/auth-storage", () => ({
  getStoredToken: getStoredTokenMock,
}));

import { ApiError, apiGet, setUnauthorizedHandler } from "@/lib/api/client";

function mockFetchOnce(body: unknown, status: number) {
  global.fetch = vi.fn().mockResolvedValue({
    ok: status >= 200 && status < 300,
    status,
    json: async () => body,
  }) as unknown as typeof fetch;
}

describe("api client", () => {
  beforeEach(() => {
    getStoredTokenMock.mockReset();
    setUnauthorizedHandler(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("throws ApiError with the server message on a failed request", async () => {
    getStoredTokenMock.mockReturnValue(null);
    mockFetchOnce({ success: false, message: "Not found", data: null }, 404);

    await expect(apiGet("/api/posts/1")).rejects.toMatchObject({
      message: "Not found",
      status: 404,
    });
  });

  it("returns the unwrapped data on success", async () => {
    getStoredTokenMock.mockReturnValue(null);
    mockFetchOnce({ success: true, message: "OK", data: { id: 1 } }, 200);

    await expect(apiGet("/api/posts/1")).resolves.toEqual({ id: 1 });
  });

  it("fires the unauthorized handler on 401 when a token was sent", async () => {
    const handler = vi.fn();
    setUnauthorizedHandler(handler);
    getStoredTokenMock.mockReturnValue("some-token");
    mockFetchOnce({ success: false, message: "Unauthorized", data: null }, 401);

    await expect(apiGet("/api/me")).rejects.toBeInstanceOf(ApiError);
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it("does not fire the unauthorized handler on 401 for an anonymous request", async () => {
    const handler = vi.fn();
    setUnauthorizedHandler(handler);
    getStoredTokenMock.mockReturnValue(null);
    mockFetchOnce({ success: false, message: "Unauthorized", data: null }, 401);

    await expect(apiGet("/api/feed")).rejects.toBeInstanceOf(ApiError);
    expect(handler).not.toHaveBeenCalled();
  });
});

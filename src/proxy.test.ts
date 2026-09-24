import { NextRequest } from "next/server";
import { describe, expect, it } from "vitest";
import { proxy } from "@/proxy";

function request(path: string, token?: string) {
  return new NextRequest(`http://localhost${path}`, {
    headers: token ? { cookie: `sociality_token=${token}` } : undefined,
  });
}

describe("proxy", () => {
  it("rewrites the feed to the signed-in variant when a token exists", () => {
    const res = proxy(request("/feed", "abc"));
    expect(res.headers.get("x-middleware-rewrite")).toBe("http://localhost/feed/signed-in");
  });

  it("serves the public feed without a token", () => {
    const res = proxy(request("/feed"));
    expect(res.headers.get("x-middleware-rewrite")).toBeNull();
    expect(res.status).toBe(200);
  });

  it("redirects guarded routes to login without a token", () => {
    const res = proxy(request("/me"));
    expect(res.status).toBe(307);
    expect(res.headers.get("location")).toBe("http://localhost/login?returnTo=%2Fme");
  });

  it("lets guarded routes through with a token", () => {
    const res = proxy(request("/me", "abc"));
    expect(res.status).toBe(200);
  });
});

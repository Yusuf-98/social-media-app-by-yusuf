import { NextResponse, type NextRequest } from "next/server";
import { TOKEN_KEY } from "@/lib/auth-constants";

export function proxy(request: NextRequest) {
  const token = request.cookies.get(TOKEN_KEY)?.value;

  // Feed variant
  if (request.nextUrl.pathname === "/feed") {
    return token
      ? NextResponse.rewrite(new URL("/feed/signed-in", request.url))
      : NextResponse.next();
  }

  // Guarded routes
  if (!token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("returnTo", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/feed", "/posts/create", "/me", "/me/:path*"],
};

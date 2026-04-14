import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value || null;
  const { pathname } = req.nextUrl;

  // ✅ Allow static files & Next internals
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // ✅ If NOT logged in → only allow /login
  if (!token && pathname !== "/login") {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // ✅ If logged in → block login page
  if (token && pathname === "/login") {
    return NextResponse.redirect(new URL("/users", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/users/:path*", "/login"],
};

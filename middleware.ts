import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const { pathname } = req.nextUrl;

  // ✅ Allow Next.js internals & static files safely
  if (pathname.startsWith("/_next") || pathname.startsWith("/favicon.ico")) {
    return NextResponse.next();
  }

  // ✅ If NOT logged in → redirect to login
  if (!token && pathname.startsWith("/users")) {
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

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const { pathname } = req.nextUrl;

  // If not logged in → redirect to login
  if (!token && pathname !== "/login") {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // If logged in → prevent going to login page
  if (token && pathname === "/login") {
    return NextResponse.redirect(new URL("/users", req.url));
  }

  // ✅ ALWAYS return something
  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/users/:path*", "/login"],
};

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;
    const pathname = req.nextUrl.pathname;

    // ✅ Protect only /users routes
    if (!token && pathname.startsWith("/users")) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    // ✅ Prevent logged-in users from accessing login
    if (token && pathname === "/login") {
      return NextResponse.redirect(new URL("/users", req.url));
    }

    return NextResponse.next();
  } catch (error) {
    // 🔥 Prevent crash → VERY IMPORTANT
    return NextResponse.next();
  }
}

export const config = {
  matcher: ["/users/:path*", "/login"],
};

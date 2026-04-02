// middleware.ts
// Lightweight middleware — reads session token with correct cookie name

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const roleHome: Record<string, string> = {
  ADMIN: "/admin",
  DEPT_HEAD: "/dept",
  LEADER: "/leader",
};

// NextAuth v5 uses different cookie names for HTTP vs HTTPS
const COOKIE_NAME_SECURE = "__Secure-authjs.session-token";
const COOKIE_NAME_DEV = "authjs.session-token";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Public paths
  if (pathname === "/login" || pathname === "/signup") return NextResponse.next();

  const isSecure = req.nextUrl.protocol === "https:";
  const token = await getToken({
    req,
    secret: process.env.AUTH_SECRET,
    cookieName: isSecure ? COOKIE_NAME_SECURE : COOKIE_NAME_DEV,
  });

  // No session → redirect to login
  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  const role = (token.role as string) ?? "LEADER";
  const home = roleHome[role] ?? "/leader";

  // Role-based access control
  if (pathname.startsWith("/admin") && role !== "ADMIN") {
    return NextResponse.redirect(new URL(home, req.url));
  }
  if (pathname.startsWith("/dept") && role !== "DEPT_HEAD") {
    return NextResponse.redirect(new URL(home, req.url));
  }
  if (pathname.startsWith("/leader") && role !== "LEADER") {
    return NextResponse.redirect(new URL(home, req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};

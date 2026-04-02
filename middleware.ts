// middleware.ts
// Lightweight middleware — uses NextAuth session token check only
// Avoids importing Prisma/bcryptjs which bloat Edge bundle

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const roleHome: Record<string, string> = {
  ADMIN: "/admin",
  DEPT_HEAD: "/dept",
  LEADER: "/leader",
};

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Public paths
  if (pathname === "/login" || pathname === "/signup") return NextResponse.next();

  const token = await getToken({ req, secret: process.env.AUTH_SECRET });

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

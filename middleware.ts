// middleware.ts
// Protects all dashboard routes and redirects unauthenticated users to /login
// Enforces three-tier role-based access: ADMIN / DEPT_HEAD / LEADER

import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

const roleHome: Record<string, string> = {
  ADMIN: "/admin",
  DEPT_HEAD: "/dept",
  LEADER: "/leader",
};

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const session = req.auth;

  // Public paths — allow without session
  if (pathname === "/login") return NextResponse.next();

  // No session → redirect to login
  if (!session) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  const role = session.user.role;
  const home = roleHome[role] ?? "/leader";

  // /admin/* — only ADMIN
  if (pathname.startsWith("/admin") && role !== "ADMIN") {
    return NextResponse.redirect(new URL(home, req.url));
  }

  // /dept/* — only DEPT_HEAD
  if (pathname.startsWith("/dept") && role !== "DEPT_HEAD") {
    return NextResponse.redirect(new URL(home, req.url));
  }

  // /leader/* — only LEADER
  if (pathname.startsWith("/leader") && role !== "LEADER") {
    return NextResponse.redirect(new URL(home, req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};

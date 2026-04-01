# Bible Study Platform — Initial Setup Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Bootstrap a Next.js (App Router) web platform for church Bible study management with Admin/Leader roles, Prisma schema, and base routing.

**Architecture:** Next.js App Router with route groups `(auth)` and `(dashboard)` to separate public and protected pages. Prisma + PostgreSQL as the data layer. NextAuth.js for session/role management. Middleware enforces role-based access.

**Tech Stack:** Next.js 14 (App Router), TypeScript, Prisma, PostgreSQL, Tailwind CSS, shadcn/ui, NextAuth.js v5 (beta)

---

## Chunk 1: Project Bootstrap & Prisma Schema

### Task 1: Initialize Next.js Project

**Files:**
- Create: `package.json`, `next.config.ts`, `tsconfig.json`, `tailwind.config.ts`, `.env.example`

- [ ] **Step 1: Create Next.js app**

```bash
cd "c:/Users/sjowo/OneDrive/바탕 화면/개발 및 자동화/교회앱/성경공부보고"
npx create-next-app@latest . \
  --typescript \
  --tailwind \
  --app \
  --no-src-dir \
  --import-alias "@/*" \
  --eslint \
  --no-turbopack
```

Expected: Project files generated in current directory.

- [ ] **Step 2: Install core dependencies**

```bash
npm install prisma @prisma/client next-auth@beta
npm install -D @types/node
```

- [ ] **Step 3: Install shadcn/ui**

```bash
npx shadcn@latest init -d
```

Expected: `components/ui/` directory created, `components.json` generated.

- [ ] **Step 4: Add key shadcn components**

```bash
npx shadcn@latest add button card badge avatar dropdown-menu sidebar navigation-menu separator skeleton table
```

- [ ] **Step 5: Create .env.example**

```bash
cat > .env.example << 'EOF'
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/bible_study_db"

# NextAuth
AUTH_SECRET="generate-with: openssl rand -base64 32"
NEXTAUTH_URL="http://localhost:3000"
EOF

cp .env.example .env
```

- [ ] **Step 6: Commit**

```bash
git init
git add .
git commit -m "init: Next.js 14 + TypeScript + Tailwind + shadcn/ui"
```

---

### Task 2: Prisma Schema

**Files:**
- Create: `prisma/schema.prisma`
- Create: `lib/prisma.ts`

- [ ] **Step 1: Initialize Prisma**

```bash
npx prisma init --datasource-provider postgresql
```

- [ ] **Step 2: Write schema**

Replace `prisma/schema.prisma` with:

```prisma
// prisma/schema.prisma
// Database schema for the church Bible study management platform

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// User roles — ADMIN manages the whole platform, LEADER manages their own learners
enum Role {
  ADMIN
  LEADER
}

// Users: both admins and leaders use this table
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String
  password  String   // hashed with bcrypt
  role      Role     @default(LEADER)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // Leader-specific relations
  learners Learner[]      // learners registered by this leader
  reports  StudyReport[]  // reports submitted by this leader

  @@map("users")
}

// Learners are individuals enrolled in Bible study by a Leader
model Learner {
  id        String   @id @default(cuid())
  name      String
  phone     String?
  notes     String?  // optional notes about the learner
  leaderId  String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  leader  User          @relation(fields: [leaderId], references: [id], onDelete: Cascade)
  reports StudyReport[] // all reports submitted about this learner

  @@map("learners")
}

// Weekly study reports submitted by a Leader for each Learner
model StudyReport {
  id         String   @id @default(cuid())
  weekDate   DateTime // the Monday of the study week (normalized to week start)
  attended   Boolean  @default(true)
  content    String   // what was studied (passage, topic, etc.)
  notes      String?  // leader's observations or prayer points
  leaderId   String
  learnerId  String
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt

  leader   User    @relation(fields: [leaderId], references: [id], onDelete: Cascade)
  learner  Learner @relation(fields: [learnerId], references: [id], onDelete: Cascade)

  // One report per learner per week
  @@unique([learnerId, weekDate])
  @@map("study_reports")
}
```

- [ ] **Step 3: Create Prisma client singleton**

Create `lib/prisma.ts`:

```typescript
// lib/prisma.ts
// Singleton Prisma client — prevents multiple connections in dev hot-reload

import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
```

- [ ] **Step 4: Push schema to DB (requires .env configured)**

```bash
npx prisma generate
# Configure DATABASE_URL in .env first, then:
# npx prisma db push
```

- [ ] **Step 5: Commit**

```bash
git add prisma/ lib/prisma.ts
git commit -m "feat(db): add Prisma schema with User/Learner/StudyReport models"
```

---

## Chunk 2: Auth & Role System

### Task 3: NextAuth Configuration

**Files:**
- Create: `lib/auth.ts`
- Create: `app/api/auth/[...nextauth]/route.ts`
- Create: `types/index.ts`

- [ ] **Step 1: Install bcryptjs**

```bash
npm install bcryptjs
npm install -D @types/bcryptjs
```

- [ ] **Step 2: Create shared TypeScript types**

Create `types/index.ts`:

```typescript
// types/index.ts
// Shared type definitions used across the platform

import type { Role } from "@prisma/client";

// Extends NextAuth session to include user role and id
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      role: Role;
    };
  }

  interface User {
    id: string;
    role: Role;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: Role;
  }
}

export type { Role };
```

- [ ] **Step 3: Create NextAuth config**

Create `lib/auth.ts`:

```typescript
// lib/auth.ts
// NextAuth v5 configuration — handles credentials login + role-based session

import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import type { Role } from "@/types";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        });

        if (!user) return null;

        const valid = await bcrypt.compare(
          credentials.password as string,
          user.password
        );
        if (!valid) return null;

        return { id: user.id, name: user.name, email: user.email, role: user.role };
      },
    }),
  ],
  callbacks: {
    // Persist id and role into JWT token
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role as Role;
      }
      return token;
    },
    // Expose id and role on the session object
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.role = token.role;
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
});
```

- [ ] **Step 4: Create NextAuth API route**

Create `app/api/auth/[...nextauth]/route.ts`:

```typescript
// app/api/auth/[...nextauth]/route.ts
// NextAuth catch-all route handler

import { handlers } from "@/lib/auth";

export const { GET, POST } = handlers;
```

- [ ] **Step 5: Commit**

```bash
git add lib/auth.ts app/api/ types/
git commit -m "feat(auth): add NextAuth v5 with credentials provider + role in session"
```

---

### Task 4: Middleware — Route Protection

**Files:**
- Create: `middleware.ts`

- [ ] **Step 1: Write middleware**

Create `middleware.ts`:

```typescript
// middleware.ts
// Protects all dashboard routes and redirects based on role

import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const session = req.auth;

  // Public paths — allow without session
  const publicPaths = ["/login"];
  if (publicPaths.includes(pathname)) return NextResponse.next();

  // No session → redirect to login
  if (!session) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  const role = session.user.role;

  // Admin trying to access leader routes → redirect to admin dashboard
  if (pathname.startsWith("/leader") && role === "ADMIN") {
    return NextResponse.redirect(new URL("/admin", req.url));
  }

  // Leader trying to access admin routes → redirect to leader dashboard
  if (pathname.startsWith("/admin") && role === "LEADER") {
    return NextResponse.redirect(new URL("/leader", req.url));
  }

  return NextResponse.next();
});

export const config = {
  // Run middleware on all routes except static assets and API
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
```

- [ ] **Step 2: Commit**

```bash
git add middleware.ts
git commit -m "feat(auth): add middleware for role-based route protection"
```

---

## Chunk 3: Layouts & Page Routing

### Task 5: Root Layout & Root Page

**Files:**
- Modify: `app/layout.tsx`
- Modify: `app/page.tsx`

- [ ] **Step 1: Update root layout**

Replace `app/layout.tsx`:

```typescript
// app/layout.tsx
// Root layout — wraps all pages, sets global metadata and fonts

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "성경공부 관리 시스템",
  description: "교회 성경공부 진행 현황 및 보고 관리 플랫폼",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
```

- [ ] **Step 2: Root page redirects based on session**

Replace `app/page.tsx`:

```typescript
// app/page.tsx
// Root page — redirects authenticated users to their role dashboard

import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function RootPage() {
  const session = await auth();

  if (!session) redirect("/login");
  if (session.user.role === "ADMIN") redirect("/admin");
  redirect("/leader");
}
```

- [ ] **Step 3: Commit**

```bash
git add app/layout.tsx app/page.tsx
git commit -m "feat(routing): root page redirects by role"
```

---

### Task 6: Login Page

**Files:**
- Create: `app/(auth)/login/page.tsx`
- Create: `app/(auth)/layout.tsx`

- [ ] **Step 1: Auth group layout**

Create `app/(auth)/layout.tsx`:

```typescript
// app/(auth)/layout.tsx
// Layout for unauthenticated pages (login, etc.) — centered card design

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      {children}
    </div>
  );
}
```

- [ ] **Step 2: Login page**

Create `app/(auth)/login/page.tsx`:

```typescript
// app/(auth)/login/page.tsx
// Login page — credentials form, server action for sign-in

"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const result = await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirect: false,
    });

    if (result?.error) {
      setError("이메일 또는 비밀번호가 올바르지 않습니다.");
      setLoading(false);
      return;
    }

    router.push("/");
  }

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-center">성경공부 관리 시스템</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">이메일</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="example@church.org"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">비밀번호</Label>
            <Input
              id="password"
              name="password"
              type="password"
              required
            />
          </div>
          {error && (
            <p className="text-sm text-red-500">{error}</p>
          )}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "로그인 중..." : "로그인"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add app/\(auth\)/
git commit -m "feat(auth): add login page with credentials form"
```

---

### Task 7: Dashboard Layout (Shared Shell)

**Files:**
- Create: `components/layout/Sidebar.tsx`
- Create: `components/layout/Header.tsx`
- Create: `app/(dashboard)/layout.tsx`

- [ ] **Step 1: Sidebar component**

Create `components/layout/Sidebar.tsx`:

```typescript
// components/layout/Sidebar.tsx
// Sidebar navigation — renders different links based on user role

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import type { Role } from "@/types";

const adminLinks = [
  { href: "/admin", label: "대시보드" },
  { href: "/admin/leaders", label: "리더 관리" },
  { href: "/admin/reports", label: "전체 보고서" },
];

const leaderLinks = [
  { href: "/leader", label: "대시보드" },
  { href: "/leader/learners", label: "내 교육생" },
  { href: "/leader/reports", label: "내 보고서" },
];

interface SidebarProps {
  role: Role;
  userName: string;
}

export function Sidebar({ role, userName }: SidebarProps) {
  const pathname = usePathname();
  const links = role === "ADMIN" ? adminLinks : leaderLinks;

  return (
    <aside className="w-60 min-h-screen bg-white border-r flex flex-col">
      {/* Brand */}
      <div className="p-6 border-b">
        <h1 className="font-bold text-lg">성경공부 관리</h1>
        <p className="text-xs text-muted-foreground mt-1">
          {role === "ADMIN" ? "관리자" : "리더"} · {userName}
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "block px-3 py-2 rounded-md text-sm font-medium transition-colors",
              pathname === link.href
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            )}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
```

- [ ] **Step 2: Header component**

Create `components/layout/Header.tsx`:

```typescript
// components/layout/Header.tsx
// Top header bar with page title and sign-out button

"use client";

import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  title: string;
}

export function Header({ title }: HeaderProps) {
  return (
    <header className="h-14 border-b bg-white flex items-center justify-between px-6">
      <h2 className="font-semibold text-sm">{title}</h2>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => signOut({ callbackUrl: "/login" })}
      >
        로그아웃
      </Button>
    </header>
  );
}
```

- [ ] **Step 3: Dashboard group layout**

Create `app/(dashboard)/layout.tsx`:

```typescript
// app/(dashboard)/layout.tsx
// Shared dashboard layout — sidebar + header shell for both admin and leader

import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/layout/Sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session) redirect("/login");

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar role={session.user.role} userName={session.user.name} />
      <div className="flex-1 flex flex-col">
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Commit**

```bash
git add components/layout/ app/\(dashboard\)/
git commit -m "feat(layout): add dashboard shell with role-aware sidebar"
```

---

### Task 8: Page Stubs — Admin

**Files:**
- Create: `app/(dashboard)/admin/page.tsx`
- Create: `app/(dashboard)/admin/leaders/page.tsx`
- Create: `app/(dashboard)/admin/reports/page.tsx`

- [ ] **Step 1: Admin dashboard page**

Create `app/(dashboard)/admin/page.tsx`:

```typescript
// app/(dashboard)/admin/page.tsx
// Admin dashboard — overview stats for the whole platform

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Header } from "@/components/layout/Header";

export default async function AdminDashboardPage() {
  const [totalLeaders, totalLearners, totalReports] = await Promise.all([
    prisma.user.count({ where: { role: "LEADER" } }),
    prisma.learner.count(),
    prisma.studyReport.count(),
  ]);

  return (
    <>
      <Header title="관리자 대시보드" />
      <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              전체 리더
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{totalLeaders}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              전체 교육생
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{totalLearners}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              전체 보고서
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{totalReports}</p>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
```

- [ ] **Step 2: Leaders list page**

Create `app/(dashboard)/admin/leaders/page.tsx`:

```typescript
// app/(dashboard)/admin/leaders/page.tsx
// Admin: list of all leaders with their learner and report counts

import { prisma } from "@/lib/prisma";
import { Header } from "@/components/layout/Header";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default async function AdminLeadersPage() {
  const leaders = await prisma.user.findMany({
    where: { role: "LEADER" },
    include: {
      _count: { select: { learners: true, reports: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <>
      <Header title="리더 관리" />
      <div className="p-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>이름</TableHead>
              <TableHead>이메일</TableHead>
              <TableHead>교육생 수</TableHead>
              <TableHead>보고서 수</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leaders.map((leader) => (
              <TableRow key={leader.id}>
                <TableCell className="font-medium">{leader.name}</TableCell>
                <TableCell>{leader.email}</TableCell>
                <TableCell>
                  <Badge variant="secondary">{leader._count.learners}</Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary">{leader._count.reports}</Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
```

- [ ] **Step 3: All reports page**

Create `app/(dashboard)/admin/reports/page.tsx`:

```typescript
// app/(dashboard)/admin/reports/page.tsx
// Admin: view all submitted study reports across all leaders

import { prisma } from "@/lib/prisma";
import { Header } from "@/components/layout/Header";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default async function AdminReportsPage() {
  const reports = await prisma.studyReport.findMany({
    include: {
      leader: { select: { name: true } },
      learner: { select: { name: true } },
    },
    orderBy: { weekDate: "desc" },
    take: 50,
  });

  return (
    <>
      <Header title="전체 보고서" />
      <div className="p-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>주차</TableHead>
              <TableHead>리더</TableHead>
              <TableHead>교육생</TableHead>
              <TableHead>내용</TableHead>
              <TableHead>출석</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reports.map((report) => (
              <TableRow key={report.id}>
                <TableCell>
                  {report.weekDate.toLocaleDateString("ko-KR")}
                </TableCell>
                <TableCell>{report.leader.name}</TableCell>
                <TableCell>{report.learner.name}</TableCell>
                <TableCell className="max-w-xs truncate">
                  {report.content}
                </TableCell>
                <TableCell>
                  <Badge variant={report.attended ? "default" : "destructive"}>
                    {report.attended ? "출석" : "결석"}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
```

- [ ] **Step 4: Commit**

```bash
git add app/\(dashboard\)/admin/
git commit -m "feat(admin): add dashboard, leaders, and reports pages"
```

---

### Task 9: Page Stubs — Leader

**Files:**
- Create: `app/(dashboard)/leader/page.tsx`
- Create: `app/(dashboard)/leader/learners/page.tsx`
- Create: `app/(dashboard)/leader/learners/new/page.tsx`
- Create: `app/(dashboard)/leader/reports/page.tsx`
- Create: `app/(dashboard)/leader/reports/new/page.tsx`

- [ ] **Step 1: Leader dashboard**

Create `app/(dashboard)/leader/page.tsx`:

```typescript
// app/(dashboard)/leader/page.tsx
// Leader dashboard — shows their learner and report counts

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function LeaderDashboardPage() {
  const session = await auth();
  const leaderId = session!.user.id;

  const [learnerCount, reportCount] = await Promise.all([
    prisma.learner.count({ where: { leaderId } }),
    prisma.studyReport.count({ where: { leaderId } }),
  ]);

  return (
    <>
      <Header title="리더 대시보드" />
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              내 교육생
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{learnerCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              제출한 보고서
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{reportCount}</p>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
```

- [ ] **Step 2: Learners list page**

Create `app/(dashboard)/leader/learners/page.tsx`:

```typescript
// app/(dashboard)/leader/learners/page.tsx
// Leader: list of their own learners

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Header } from "@/components/layout/Header";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default async function LeaderLearnersPage() {
  const session = await auth();
  const learners = await prisma.learner.findMany({
    where: { leaderId: session!.user.id },
    include: { _count: { select: { reports: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <>
      <Header title="내 교육생" />
      <div className="p-6 space-y-4">
        <div className="flex justify-end">
          <Link href="/leader/learners/new">
            <Button>교육생 등록</Button>
          </Link>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>이름</TableHead>
              <TableHead>연락처</TableHead>
              <TableHead>보고서 수</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {learners.map((learner) => (
              <TableRow key={learner.id}>
                <TableCell className="font-medium">{learner.name}</TableCell>
                <TableCell>{learner.phone ?? "-"}</TableCell>
                <TableCell>{learner._count.reports}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
```

- [ ] **Step 3: Register new learner page**

Create `app/(dashboard)/leader/learners/new/page.tsx`:

```typescript
// app/(dashboard)/leader/learners/new/page.tsx
// Leader: form to register a new learner (Server Action)

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function NewLearnerPage() {
  async function createLearner(formData: FormData) {
    "use server";
    const session = await auth();
    if (!session) redirect("/login");

    await prisma.learner.create({
      data: {
        name: formData.get("name") as string,
        phone: (formData.get("phone") as string) || null,
        notes: (formData.get("notes") as string) || null,
        leaderId: session.user.id,
      },
    });

    redirect("/leader/learners");
  }

  return (
    <>
      <Header title="교육생 등록" />
      <div className="p-6 max-w-md">
        <Card>
          <CardHeader>
            <CardTitle>새 교육생 등록</CardTitle>
          </CardHeader>
          <CardContent>
            <form action={createLearner} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">이름 *</Label>
                <Input id="name" name="name" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">연락처</Label>
                <Input id="phone" name="phone" type="tel" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">메모</Label>
                <Textarea id="notes" name="notes" rows={3} />
              </div>
              <Button type="submit" className="w-full">등록</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
```

- [ ] **Step 4: Reports list page**

Create `app/(dashboard)/leader/reports/page.tsx`:

```typescript
// app/(dashboard)/leader/reports/page.tsx
// Leader: list of their submitted reports

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Header } from "@/components/layout/Header";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default async function LeaderReportsPage() {
  const session = await auth();
  const reports = await prisma.studyReport.findMany({
    where: { leaderId: session!.user.id },
    include: { learner: { select: { name: true } } },
    orderBy: { weekDate: "desc" },
  });

  return (
    <>
      <Header title="내 보고서" />
      <div className="p-6 space-y-4">
        <div className="flex justify-end">
          <Link href="/leader/reports/new">
            <Button>보고서 제출</Button>
          </Link>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>주차</TableHead>
              <TableHead>교육생</TableHead>
              <TableHead>내용</TableHead>
              <TableHead>출석</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reports.map((report) => (
              <TableRow key={report.id}>
                <TableCell>
                  {report.weekDate.toLocaleDateString("ko-KR")}
                </TableCell>
                <TableCell>{report.learner.name}</TableCell>
                <TableCell className="max-w-xs truncate">
                  {report.content}
                </TableCell>
                <TableCell>
                  <Badge variant={report.attended ? "default" : "destructive"}>
                    {report.attended ? "출석" : "결석"}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
```

- [ ] **Step 5: Submit new report page**

Create `app/(dashboard)/leader/reports/new/page.tsx`:

```typescript
// app/(dashboard)/leader/reports/new/page.tsx
// Leader: form to submit a weekly study report (Server Action)

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default async function NewReportPage() {
  const session = await auth();
  const learners = await prisma.learner.findMany({
    where: { leaderId: session!.user.id },
    orderBy: { name: "asc" },
  });

  async function submitReport(formData: FormData) {
    "use server";
    const session = await auth();
    if (!session) redirect("/login");

    const weekDate = new Date(formData.get("weekDate") as string);

    await prisma.studyReport.create({
      data: {
        weekDate,
        attended: formData.get("attended") === "true",
        content: formData.get("content") as string,
        notes: (formData.get("notes") as string) || null,
        learnerId: formData.get("learnerId") as string,
        leaderId: session.user.id,
      },
    });

    redirect("/leader/reports");
  }

  return (
    <>
      <Header title="보고서 제출" />
      <div className="p-6 max-w-md">
        <Card>
          <CardHeader>
            <CardTitle>주간 보고서 제출</CardTitle>
          </CardHeader>
          <CardContent>
            <form action={submitReport} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="learnerId">교육생 *</Label>
                <Select name="learnerId" required>
                  <SelectTrigger>
                    <SelectValue placeholder="교육생 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    {learners.map((l) => (
                      <SelectItem key={l.id} value={l.id}>
                        {l.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="weekDate">주차 날짜 *</Label>
                <Input id="weekDate" name="weekDate" type="date" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="attended">출석 여부 *</Label>
                <Select name="attended" required>
                  <SelectTrigger>
                    <SelectValue placeholder="선택" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">출석</SelectItem>
                    <SelectItem value="false">결석</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="content">공부 내용 *</Label>
                <Textarea id="content" name="content" rows={4} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">메모</Label>
                <Textarea id="notes" name="notes" rows={2} />
              </div>
              <Button type="submit" className="w-full">제출</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
```

- [ ] **Step 6: Commit**

```bash
git add app/\(dashboard\)/leader/
git commit -m "feat(leader): add dashboard, learner, and report pages"
```

---

## Chunk 4: DB Seed & Final Verification

### Task 10: Seed Script & Verification

**Files:**
- Create: `prisma/seed.ts`
- Modify: `package.json` (add seed script)

- [ ] **Step 1: Create seed script**

Create `prisma/seed.ts`:

```typescript
// prisma/seed.ts
// Seeds initial admin and test leader accounts for development

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const adminPassword = await bcrypt.hash("admin1234", 10);
  const leaderPassword = await bcrypt.hash("leader1234", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@church.org" },
    update: {},
    create: {
      email: "admin@church.org",
      name: "관리자",
      password: adminPassword,
      role: "ADMIN",
    },
  });

  const leader = await prisma.user.upsert({
    where: { email: "leader1@church.org" },
    update: {},
    create: {
      email: "leader1@church.org",
      name: "리더1",
      password: leaderPassword,
      role: "LEADER",
    },
  });

  console.log("Seeded:", { admin: admin.email, leader: leader.email });
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
```

- [ ] **Step 2: Add seed config to package.json**

Add to `package.json`:
```json
"prisma": {
  "seed": "ts-node --compiler-options '{\"module\":\"CommonJS\"}' prisma/seed.ts"
}
```

Install ts-node: `npm install -D ts-node`

- [ ] **Step 3: Run migration + seed**

```bash
npx prisma db push
npx prisma db seed
```

Expected: "Seeded: { admin: 'admin@church.org', leader: 'leader1@church.org' }"

- [ ] **Step 4: Final build check**

```bash
npm run build
```

Expected: Build completes with 0 errors.

- [ ] **Step 5: Final commit**

```bash
git add prisma/seed.ts package.json
git commit -m "feat(db): add seed script with admin and leader accounts"
```

---

## Final Directory Structure

```
성경공부보고/
├── app/
│   ├── (auth)/
│   │   ├── layout.tsx          # Centered layout for login
│   │   └── login/
│   │       └── page.tsx        # Credentials login form
│   ├── (dashboard)/
│   │   ├── layout.tsx          # Sidebar + content shell
│   │   ├── admin/
│   │   │   ├── page.tsx        # Admin overview stats
│   │   │   ├── leaders/
│   │   │   │   └── page.tsx    # All leaders table
│   │   │   └── reports/
│   │   │       └── page.tsx    # All reports table
│   │   └── leader/
│   │       ├── page.tsx        # Leader overview stats
│   │       ├── learners/
│   │       │   ├── page.tsx    # My learners table
│   │       │   └── new/
│   │       │       └── page.tsx # Register learner form
│   │       └── reports/
│   │           ├── page.tsx    # My reports table
│   │           └── new/
│   │               └── page.tsx # Submit report form
│   ├── api/
│   │   └── auth/
│   │       └── [...nextauth]/
│   │           └── route.ts    # NextAuth handler
│   ├── globals.css
│   ├── layout.tsx              # Root HTML shell + metadata
│   └── page.tsx                # Root redirect by role
├── components/
│   ├── layout/
│   │   ├── Header.tsx          # Top bar + sign-out
│   │   └── Sidebar.tsx         # Role-aware nav links
│   └── ui/                     # shadcn/ui components
├── lib/
│   ├── auth.ts                 # NextAuth config
│   ├── prisma.ts               # Prisma singleton
│   └── utils.ts                # cn() utility
├── prisma/
│   ├── schema.prisma           # DB schema
│   └── seed.ts                 # Dev seed data
├── types/
│   └── index.ts                # Shared types + NextAuth augments
├── middleware.ts               # Route protection
├── .env.example
├── next.config.ts
└── tailwind.config.ts
```

---

## Next Development Steps

1. **Server Actions hardening** — add Zod validation to all form server actions
2. **Error boundaries** — add `error.tsx` and `not-found.tsx` to route groups
3. **Report detail view** — `/leader/reports/[id]` and `/admin/reports/[id]`
4. **Admin: create leader** — form to create new leader accounts
5. **Pagination** — add cursor-based pagination to report and learner tables
6. **Email notifications** — notify leaders of admin comments via email

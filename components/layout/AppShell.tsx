// components/layout/AppShell.tsx
// Responsive app shell — skip-link, sidebar desktop, bottom nav mobile

"use client";

import { Sidebar } from "@/components/layout/Sidebar";
import { BottomNav } from "@/components/layout/BottomNav";
import type { Role } from "@/types";

interface AppShellProps {
  role: Role;
  userName: string;
  children: React.ReactNode;
}

export function AppShell({ role, userName, children }: AppShellProps) {
  return (
    <div className="flex min-h-screen bg-background">
      {/* WCAG 2.4.1 — Skip to main content */}
      <a href="#main-content" className="skip-link">
        본문으로 건너뛰기
      </a>

      {/* Desktop sidebar */}
      <div className="hidden md:block">
        <Sidebar role={role} userName={userName} />
      </div>

      {/* Main content */}
      <main id="main-content" className="flex-1 flex flex-col overflow-auto pb-20 md:pb-0" tabIndex={-1}>
        {children}
      </main>

      {/* Mobile bottom nav */}
      <BottomNav role={role} />
    </div>
  );
}

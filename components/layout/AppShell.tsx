// components/layout/AppShell.tsx
// Responsive app shell — sidebar on desktop, bottom nav on mobile

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
      {/* Desktop sidebar — hidden on mobile */}
      <div className="hidden md:block">
        <Sidebar role={role} userName={userName} />
      </div>

      {/* Main content */}
      <main className="flex-1 flex flex-col overflow-auto pb-16 md:pb-0">
        {children}
      </main>

      {/* Mobile bottom nav — hidden on desktop */}
      <BottomNav role={role} />
    </div>
  );
}

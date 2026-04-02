// components/layout/BottomNav.tsx
// Clean mobile bottom nav — minimal style

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import type { Role } from "@/types";
import {
  LayoutDashboard,
  Users,
  FileText,
  UserCog,
  TrendingUp,
  Settings,
  type LucideIcon,
} from "lucide-react";

interface TabItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

const adminTabs: TabItem[] = [
  { href: "/admin", label: "홈", icon: LayoutDashboard },
  { href: "/admin/leaders", label: "리더", icon: UserCog },
  { href: "/admin/reports", label: "보고서", icon: FileText },
  { href: "/admin/progress", label: "진도", icon: TrendingUp },
];

const deptTabs: TabItem[] = [
  { href: "/dept", label: "홈", icon: LayoutDashboard },
  { href: "/dept/leaders", label: "리더", icon: UserCog },
  { href: "/dept/reports", label: "보고서", icon: FileText },
  { href: "/dept/progress", label: "진도", icon: TrendingUp },
];

const leaderTabs: TabItem[] = [
  { href: "/leader", label: "홈", icon: LayoutDashboard },
  { href: "/leader/learners", label: "교육생", icon: Users },
  { href: "/leader/reports", label: "보고서", icon: FileText },
  { href: "/settings", label: "설정", icon: Settings },
];

const roleTabs: Record<string, TabItem[]> = {
  ADMIN: adminTabs,
  DEPT_HEAD: deptTabs,
  LEADER: leaderTabs,
};

interface BottomNavProps {
  role: Role;
}

export function BottomNav({ role }: BottomNavProps) {
  const pathname = usePathname();
  const tabs = roleTabs[role] ?? leaderTabs;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t md:hidden safe-area-bottom" aria-label="모바일 메뉴">
      <div className="flex items-center justify-around h-14">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = pathname === tab.href ||
            (tab.href.length > 1 && pathname.startsWith(tab.href + "/"));

          return (
            <Link
              key={tab.href}
              href={tab.href}
              aria-current={isActive ? "page" : undefined}
              aria-label={tab.label}
              className={cn(
                "flex flex-col items-center justify-center gap-0.5 min-h-[44px] px-4 transition-colors",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground"
              )}
            >
              <Icon className="h-5 w-5" aria-hidden="true" />
              <span className="text-[10px] font-medium">{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

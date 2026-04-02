// components/layout/Sidebar.tsx
// Linear-style sidebar — clean white bg, left border active indicator

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
  Building2,
  GraduationCap,
  type LucideIcon,
} from "lucide-react";

interface NavLink {
  href: string;
  label: string;
  icon: LucideIcon;
}

const adminLinks: NavLink[] = [
  { href: "/admin", label: "대시보드", icon: LayoutDashboard },
  { href: "/admin/leaders", label: "리더 관리", icon: UserCog },
  { href: "/admin/departments", label: "부서 관리", icon: Building2 },
  { href: "/admin/curriculum", label: "커리큘럼", icon: GraduationCap },
  { href: "/admin/reports", label: "전체 보고서", icon: FileText },
  { href: "/admin/progress", label: "진도 현황", icon: TrendingUp },
];

const deptHeadLinks: NavLink[] = [
  { href: "/dept", label: "대시보드", icon: LayoutDashboard },
  { href: "/dept/leaders", label: "부서 리더", icon: UserCog },
  { href: "/dept/reports", label: "부서 보고서", icon: FileText },
  { href: "/dept/progress", label: "진도 현황", icon: TrendingUp },
];

const leaderLinks: NavLink[] = [
  { href: "/leader", label: "대시보드", icon: LayoutDashboard },
  { href: "/leader/learners", label: "내 교육생", icon: Users },
  { href: "/leader/reports", label: "내 보고서", icon: FileText },
];

interface SidebarProps {
  role: Role;
  userName: string;
}

const roleLabel: Record<string, string> = {
  ADMIN: "목회자",
  DEPT_HEAD: "기관장",
  LEADER: "진행자",
};

const roleLinks: Record<string, NavLink[]> = {
  ADMIN: adminLinks,
  DEPT_HEAD: deptHeadLinks,
  LEADER: leaderLinks,
};

export function Sidebar({ role, userName }: SidebarProps) {
  const pathname = usePathname();
  const links = roleLinks[role] ?? leaderLinks;

  return (
    <aside className="w-56 min-h-screen bg-background border-r flex flex-col shrink-0" aria-label="사이드바 메뉴">
      {/* Brand */}
      <div className="px-4 py-5 border-b">
        <h1 className="font-semibold text-sm tracking-tight">성경공부 관리</h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          {roleLabel[role] ?? role} · {userName}
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-3 space-y-0.5" aria-label="주요 메뉴">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href ||
            (link.href !== "/" && link.href.length > 1 && pathname.startsWith(link.href + "/"));

          return (
            <Link
              key={link.href}
              href={link.href}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "flex items-center gap-2.5 px-3 py-2 rounded-md text-[13px] font-medium transition-colors",
                isActive
                  ? "bg-secondary text-foreground"
                  : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
              )}
            >
              <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
              {link.label}
            </Link>
          );
        })}
      </nav>

      {/* Settings */}
      <div className="px-2 py-3 border-t">
        <Link
          href="/settings"
          aria-current={pathname === "/settings" ? "page" : undefined}
          className={cn(
            "flex items-center gap-2.5 px-3 py-2 rounded-md text-[13px] font-medium transition-colors",
            pathname === "/settings"
              ? "bg-secondary text-foreground"
              : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
          )}
        >
          <Settings className="h-4 w-4 shrink-0" aria-hidden="true" />
          설정
        </Link>
      </div>
    </aside>
  );
}

// components/layout/Sidebar.tsx
// Sidebar navigation — renders different links based on user role with icons

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
  BookOpen,
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
    <aside className="w-60 min-h-screen bg-card border-r flex flex-col shrink-0" aria-label="사이드바 메뉴">
      {/* Brand + user info */}
      <div className="p-6 border-b">
        <div className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-primary" />
          <h1 className="font-serif font-bold text-base">성경공부 관리</h1>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          {roleLabel[role] ?? role} · {userName}
        </p>
      </div>

      {/* Navigation links */}
      <nav className="flex-1 p-4 space-y-1" aria-label="주요 메뉴">
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
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              )}
            >
              <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
              {link.label}
            </Link>
          );
        })}
      </nav>

      {/* Settings link */}
      <div className="p-4 border-t">
        <Link
          href="/settings"
          aria-current={pathname === "/settings" ? "page" : undefined}
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            pathname === "/settings"
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:bg-secondary hover:text-foreground"
          )}
        >
          <Settings className="h-4 w-4 shrink-0" aria-hidden="true" />
          설정
        </Link>
      </div>
    </aside>
  );
}

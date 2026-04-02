// components/layout/Sidebar.tsx
// Grouped sidebar — IA sections for "관리" and "분석" with labels

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

interface NavGroup {
  title: string;
  links: NavLink[];
}

const adminGroups: NavGroup[] = [
  {
    title: "개요",
    links: [
      { href: "/admin", label: "대시보드", icon: LayoutDashboard },
    ],
  },
  {
    title: "관리",
    links: [
      { href: "/admin/leaders", label: "리더 관리", icon: UserCog },
      { href: "/admin/departments", label: "부서 관리", icon: Building2 },
      { href: "/admin/curriculum", label: "커리큘럼", icon: GraduationCap },
    ],
  },
  {
    title: "분석",
    links: [
      { href: "/admin/reports", label: "전체 보고서", icon: FileText },
      { href: "/admin/progress", label: "진도 현황", icon: TrendingUp },
    ],
  },
];

const deptHeadGroups: NavGroup[] = [
  {
    title: "개요",
    links: [
      { href: "/dept", label: "대시보드", icon: LayoutDashboard },
    ],
  },
  {
    title: "관리",
    links: [
      { href: "/dept/leaders", label: "부서 리더", icon: UserCog },
    ],
  },
  {
    title: "분석",
    links: [
      { href: "/dept/reports", label: "부서 보고서", icon: FileText },
      { href: "/dept/progress", label: "진도 현황", icon: TrendingUp },
    ],
  },
];

const leaderGroups: NavGroup[] = [
  {
    title: "개요",
    links: [
      { href: "/leader", label: "대시보드", icon: LayoutDashboard },
    ],
  },
  {
    title: "관리",
    links: [
      { href: "/leader/learners", label: "내 교육생", icon: Users },
      { href: "/leader/reports", label: "내 보고서", icon: FileText },
    ],
  },
];

const roleLabel: Record<string, string> = {
  ADMIN: "목회자",
  DEPT_HEAD: "기관장",
  LEADER: "진행자",
};

const roleGroups: Record<string, NavGroup[]> = {
  ADMIN: adminGroups,
  DEPT_HEAD: deptHeadGroups,
  LEADER: leaderGroups,
};

interface SidebarProps {
  role: Role;
  userName: string;
}

export function Sidebar({ role, userName }: SidebarProps) {
  const pathname = usePathname();
  const groups = roleGroups[role] ?? leaderGroups;

  return (
    <aside
      className="w-[220px] min-h-screen bg-card border-r border-border/50 flex flex-col shrink-0"
      aria-label="사이드바 메뉴"
    >
      {/* Brand */}
      <div className="px-5 py-5">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center" aria-hidden="true">
            <span className="text-white text-xs font-bold">SG</span>
          </div>
          <div>
            <h1 className="font-semibold text-[13px] tracking-tight">성경공부 관리</h1>
            <p className="text-[11px] text-muted-foreground">
              {roleLabel[role] ?? role} · {userName}
            </p>
          </div>
        </div>
      </div>

      {/* Grouped navigation */}
      <nav className="flex-1 px-3 space-y-4 overflow-y-auto" aria-label="주요 메뉴">
        {groups.map((group) => (
          <div key={group.title} role="group" aria-label={group.title}>
            <p className="px-3 mb-1 text-[10px] font-semibold tracking-wider text-muted-foreground/70 select-none">
              {group.title}
            </p>
            <div className="space-y-0.5">
              {group.links.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href ||
                  (link.href !== "/" && link.href.length > 1 && pathname.startsWith(link.href + "/"));

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    aria-current={isActive ? "page" : undefined}
                    className={cn(
                      "flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-medium transition-all duration-150",
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                    )}
                  >
                    <Icon className={cn("h-[18px] w-[18px] shrink-0", isActive && "text-primary")} aria-hidden="true" />
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Settings — bottom */}
      <div className="px-3 py-4 border-t border-border/50">
        <Link
          href="/settings"
          aria-current={pathname === "/settings" ? "page" : undefined}
          className={cn(
            "flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-medium transition-all duration-150",
            pathname === "/settings"
              ? "bg-primary/10 text-primary"
              : "text-muted-foreground hover:bg-muted/80 hover:text-foreground"
          )}
        >
          <Settings className="h-[18px] w-[18px] shrink-0" aria-hidden="true" />
          설정
        </Link>
      </div>
    </aside>
  );
}

// components/dashboard/QuickActions.tsx
// Clean action cards for leader dashboard

import Link from "next/link";
import { FileText, Users, BookOpen } from "lucide-react";

const actions = [
  {
    href: "/leader/reports/new",
    label: "보고서 제출",
    description: "주간 보고서 작성",
    icon: FileText,
    color: "text-primary",
  },
  {
    href: "/leader/learners",
    label: "교육생 관리",
    description: "교육생 목록 확인",
    icon: Users,
    color: "text-emerald-600",
  },
  {
    href: "/leader/reports",
    label: "보고서 조회",
    description: "제출 내역 확인",
    icon: BookOpen,
    color: "text-violet-600",
  },
];

export function QuickActions() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      {actions.map((action) => (
        <Link key={action.href} href={action.href}>
          <div className="rounded-lg border bg-card p-4 space-y-2 transition-colors hover:bg-secondary/50 active:bg-secondary cursor-pointer">
            <action.icon className={`h-5 w-5 ${action.color}`} />
            <div>
              <h3 className="font-medium text-sm">{action.label}</h3>
              <p className="text-xs text-muted-foreground">{action.description}</p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

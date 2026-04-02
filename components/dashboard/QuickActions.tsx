// components/dashboard/QuickActions.tsx
// Bento-style action cards — icon accent, hover lift

import Link from "next/link";
import { FileText, Users, BookOpen, ArrowRight } from "lucide-react";

const actions = [
  {
    href: "/leader/reports/new",
    label: "보고서 제출",
    description: "주간 보고서 작성",
    icon: FileText,
    accent: "bg-primary/10 text-primary",
  },
  {
    href: "/leader/learners",
    label: "교육생 관리",
    description: "교육생 목록 확인",
    icon: Users,
    accent: "bg-emerald-500/10 text-emerald-600",
  },
  {
    href: "/leader/reports",
    label: "보고서 조회",
    description: "제출 내역 확인",
    icon: BookOpen,
    accent: "bg-violet-500/10 text-violet-600",
  },
];

export function QuickActions() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {actions.map((action) => (
        <Link key={action.href} href={action.href}>
          <div className="bento-card group cursor-pointer">
            <div className={`h-10 w-10 rounded-xl ${action.accent} flex items-center justify-center mb-3`}>
              <action.icon className="h-5 w-5" />
            </div>
            <h3 className="font-semibold text-sm mb-0.5">{action.label}</h3>
            <p className="text-xs text-muted-foreground">{action.description}</p>
            <div className="mt-3 flex items-center text-xs font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
              바로가기
              <ArrowRight className="h-3 w-3 ml-1" />
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

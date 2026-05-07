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
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
      {actions.map((action) => (
        <Link key={action.href} href={action.href} className="block">
          <div className="bento-card group flex cursor-pointer items-center gap-3 !p-4 sm:block sm:!p-5">
            <div className={`h-10 w-10 rounded-xl ${action.accent} flex shrink-0 items-center justify-center sm:mb-3`}>
              <action.icon className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-sm mb-0.5 truncate">{action.label}</h3>
              <p className="text-xs text-muted-foreground truncate">{action.description}</p>
            </div>
            <div className="ml-auto flex shrink-0 items-center text-xs font-medium text-primary opacity-100 transition-opacity sm:ml-0 sm:mt-3 sm:opacity-0 sm:group-hover:opacity-100">
              바로가기
              <ArrowRight className="h-3 w-3 ml-1" />
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

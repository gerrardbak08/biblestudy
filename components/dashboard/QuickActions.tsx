// components/dashboard/QuickActions.tsx
// Large action cards for leader dashboard — quick access to common tasks

import Link from "next/link";
import { FileText, Users, BookOpen } from "lucide-react";

interface QuickAction {
  href: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

const actions: QuickAction[] = [
  {
    href: "/leader/reports/new",
    label: "보고서 제출",
    description: "주간 성경공부 보고서를 작성합니다",
    icon: <FileText className="h-6 w-6" />,
    color: "bg-primary/10 text-primary",
  },
  {
    href: "/leader/learners",
    label: "교육생 관리",
    description: "교육생 목록을 확인하고 관리합니다",
    icon: <Users className="h-6 w-6" />,
    color: "bg-accent text-accent-foreground",
  },
  {
    href: "/leader/reports",
    label: "보고서 조회",
    description: "제출한 보고서를 확인합니다",
    icon: <BookOpen className="h-6 w-6" />,
    color: "bg-secondary text-secondary-foreground",
  },
];

export function QuickActions() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      {actions.map((action) => (
        <Link key={action.href} href={action.href}>
          <div className="rounded-xl border bg-card p-5 space-y-3 transition-all hover:shadow-md hover:-translate-y-0.5 active:scale-[0.98] cursor-pointer">
            <div className={`inline-flex items-center justify-center w-10 h-10 rounded-xl ${action.color}`}>
              {action.icon}
            </div>
            <div>
              <h3 className="font-semibold text-sm">{action.label}</h3>
              <p className="text-xs text-muted-foreground mt-0.5">{action.description}</p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

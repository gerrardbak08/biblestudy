// components/dashboard/MissingReportAlert.tsx
// Alert with CTA — shows missing leaders + action link

import { AlertCircle } from "lucide-react";
import Link from "next/link";

interface MissingLeader {
  name: string;
  department: string;
  learnerCount: number;
}

export function MissingReportAlert({ leaders }: { leaders: MissingLeader[] }) {
  return (
    <div
      className="bento-card !border-red-200/60 dark:!border-red-800/40 !bg-red-50/50 dark:!bg-red-950/20"
      role="alert"
    >
      <div className="flex items-start gap-3">
        <div className="h-8 w-8 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center shrink-0">
          <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-red-900 dark:text-red-200">
                이번 주 미제출 리더
              </h3>
              <span className="inline-flex items-center justify-center h-5 min-w-[20px] px-1.5 rounded-full bg-red-600 text-white text-[10px] font-bold">
                {leaders.length}
              </span>
            </div>
            <Link
              href="/admin/leaders"
              className="text-[11px] font-semibold text-red-700 dark:text-red-300 hover:underline compact-link whitespace-nowrap"
            >
              리더 관리 &rarr;
            </Link>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {leaders.map((l) => (
              <span
                key={l.name}
                className="inline-flex items-center text-xs bg-white/80 dark:bg-red-900/20 text-red-800 dark:text-red-300 rounded-lg px-2.5 py-1 border border-red-200/40 dark:border-red-800/40"
              >
                {l.name}
                <span className="text-red-400 dark:text-red-500 ml-1.5">{l.department}</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

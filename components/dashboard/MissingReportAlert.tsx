// components/dashboard/MissingReportAlert.tsx
// Alert with CTA — shows missing leaders + action link

import { AlertCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface MissingLeader {
  name: string;
  department: string;
  learnerCount: number;
}

export function MissingReportAlert({ leaders }: { leaders: MissingLeader[] }) {
  const visibleLeaders = leaders.slice(0, 8);
  const hiddenCount = Math.max(leaders.length - visibleLeaders.length, 0);

  return (
    <div
      className="bento-card !border-red-200/60 !bg-red-50/50 !p-4 dark:!border-red-800/40 dark:!bg-red-950/20 sm:!p-5"
      role="alert"
    >
      <div className="flex items-start gap-3">
        <div className="h-8 w-8 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center shrink-0">
          <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-col items-stretch gap-2 mb-2 min-[420px]:flex-row min-[420px]:items-start min-[420px]:justify-between">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-red-900 dark:text-red-200">
                이번 주 미제출 리더
              </h3>
              <span className="inline-flex items-center justify-center h-5 min-w-[20px] px-1.5 rounded-full bg-red-600 text-white text-[10px] font-bold">
                {leaders.length}
              </span>
            </div>
            <Button asChild size="sm" variant="outline" className="h-9 w-full shrink-0 border-red-200 bg-white text-red-800 hover:bg-red-100 dark:border-red-800/60 dark:bg-red-950/30 dark:text-red-200 min-[420px]:h-8 min-[420px]:w-auto">
              <Link href="/admin/leaders">리더 현황</Link>
            </Button>
          </div>
          <p className="mb-3 text-xs text-red-700/80 dark:text-red-300/80">
            교육생이 있으나 이번 주 보고서가 아직 없는 리더입니다.
          </p>
          <div className="flex flex-wrap gap-1.5">
            {visibleLeaders.map((l) => (
              <span
                key={l.name}
                className="inline-flex items-center text-xs bg-white/80 dark:bg-red-900/20 text-red-800 dark:text-red-300 rounded-lg px-2.5 py-1 border border-red-200/40 dark:border-red-800/40"
              >
                {l.name}
                <span className="text-red-400 dark:text-red-500 ml-1.5">{l.department}</span>
                <span className="text-red-400 dark:text-red-500 ml-1.5">{l.learnerCount}명</span>
              </span>
            ))}
            {hiddenCount > 0 && (
              <span className="inline-flex items-center text-xs bg-white/80 text-red-800 rounded-lg px-2.5 py-1 border border-red-200/40 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800/40">
                +{hiddenCount}명
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

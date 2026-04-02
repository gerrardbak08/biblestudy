// components/dashboard/MissingReportAlert.tsx
// Alert card showing leaders who haven't submitted this week

import { AlertCircle } from "lucide-react";

interface MissingLeader {
  name: string;
  department: string;
  learnerCount: number;
}

export function MissingReportAlert({ leaders }: { leaders: MissingLeader[] }) {
  return (
    <div className="rounded-lg border border-amber-200 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-800 p-4">
      <div className="flex items-start gap-3">
        <AlertCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-medium text-amber-900 dark:text-amber-200">
            이번 주 미제출 리더 {leaders.length}명
          </h3>
          <div className="mt-2 flex flex-wrap gap-2">
            {leaders.map((l) => (
              <span
                key={l.name}
                className="inline-flex items-center text-xs bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 rounded-md px-2 py-1"
              >
                {l.name}
                <span className="text-amber-500 ml-1">({l.department})</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

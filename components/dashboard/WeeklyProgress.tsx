// components/dashboard/WeeklyProgress.tsx
// Modern weekly progress — clean list, animated progress

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Circle, PenLine } from "lucide-react";
import Link from "next/link";

interface LearnerStatus {
  id: string;
  name: string;
  submitted: boolean;
}

interface WeeklyProgressProps {
  learners: LearnerStatus[];
  totalReports: number;
}

export function WeeklyProgress({ learners, totalReports }: WeeklyProgressProps) {
  const submitted = learners.filter((l) => l.submitted).length;
  const total = learners.length;
  const percentage = total > 0 ? Math.round((submitted / total) * 100) : 0;
  const missing = total - submitted;

  return (
    <div className="bento-card space-y-4 !p-4 sm:!p-5">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-sm">제출 현황</h3>
        <Badge variant="secondary" className="text-[11px] font-medium rounded-lg">
          총 {totalReports}건
        </Badge>
      </div>

      {/* Progress */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">
            제출 {submitted} / {total}명
          </span>
          <span className="text-sm font-bold text-primary tabular-nums">{percentage}%</span>
        </div>
        <div className="h-2 bg-muted/60 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-700 ease-out"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      {missing > 0 && (
        <div className="flex flex-col items-stretch gap-2 rounded-lg border border-amber-200/70 bg-amber-50 px-3 py-3 dark:border-amber-900/40 dark:bg-amber-950/20 sm:flex-row sm:items-center sm:justify-between sm:gap-3 sm:py-2">
          <p className="text-xs font-medium text-amber-900 dark:text-amber-200">
            미제출 교육생 {missing}명
          </p>
          <Button asChild size="sm" variant="outline" className="h-9 w-full shrink-0 border-amber-300 bg-white text-amber-900 hover:bg-amber-100 dark:bg-amber-950/30 dark:text-amber-100 sm:h-8 sm:w-auto">
            <Link href="/leader/reports/new">
              <PenLine className="h-3.5 w-3.5" />
              작성
            </Link>
          </Button>
        </div>
      )}

      {/* Learner list */}
      {total > 0 && (
        <div className="space-y-0.5">
          {learners.map((learner) => (
            <div
              key={learner.id}
              className="flex min-h-[44px] items-center gap-2.5 rounded-lg px-2 py-2 text-sm transition-colors hover:bg-muted/40"
            >
              {learner.submitted ? (
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
              ) : (
                <Circle className="h-4 w-4 text-muted-foreground/30 shrink-0" />
              )}
              <span className={`min-w-0 flex-1 truncate ${learner.submitted ? "text-foreground font-medium" : "text-muted-foreground"}`}>
                {learner.name}
              </span>
              {!learner.submitted && (
                <Button asChild size="sm" variant="ghost" className="h-9 shrink-0 px-2 text-[11px] text-primary sm:h-8">
                  <Link href={`/leader/reports/new?learnerId=${learner.id}`}>
                    <PenLine className="h-3.5 w-3.5" />
                    작성
                  </Link>
                </Button>
              )}
            </div>
          ))}
        </div>
      )}

      {total === 0 && (
        <p className="text-sm text-muted-foreground py-4 text-center">
          등록된 교육생이 없습니다.
        </p>
      )}
    </div>
  );
}

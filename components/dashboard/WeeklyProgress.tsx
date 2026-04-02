// components/dashboard/WeeklyProgress.tsx
// Modern weekly progress — clean list, animated progress

import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Circle } from "lucide-react";

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

  return (
    <div className="bento-card space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-sm">이번 주 현황</h3>
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

      {/* Learner list */}
      {total > 0 && (
        <div className="space-y-0.5">
          {learners.map((learner) => (
            <div
              key={learner.id}
              className="flex items-center gap-2.5 text-sm py-1.5 px-2 rounded-lg hover:bg-muted/40 transition-colors"
            >
              {learner.submitted ? (
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
              ) : (
                <Circle className="h-4 w-4 text-muted-foreground/30 shrink-0" />
              )}
              <span className={learner.submitted ? "text-foreground font-medium" : "text-muted-foreground"}>
                {learner.name}
              </span>
              {!learner.submitted && (
                <span className="text-[10px] text-red-500/70 font-medium ml-auto">미제출</span>
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

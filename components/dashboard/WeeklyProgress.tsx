// components/dashboard/WeeklyProgress.tsx
// Visual weekly submission progress for leader dashboard

import { Badge } from "@/components/ui/badge";
import { CheckCircle, Circle } from "lucide-react";

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
    <div className="rounded-xl border bg-card p-5 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-sm">이번 주 현황</h3>
        <Badge variant="secondary" className="text-xs">
          총 {totalReports}건 제출
        </Badge>
      </div>

      {/* Progress bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>제출 {submitted} / {total}명</span>
          <span>{percentage}%</span>
        </div>
        <div className="h-2 bg-secondary rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-500"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      {/* Learner list */}
      {total > 0 && (
        <div className="space-y-1.5">
          {learners.map((learner) => (
            <div
              key={learner.id}
              className="flex items-center gap-2 text-sm py-1"
            >
              {learner.submitted ? (
                <CheckCircle className="h-4 w-4 text-primary shrink-0" />
              ) : (
                <Circle className="h-4 w-4 text-muted-foreground/40 shrink-0" />
              )}
              <span className={learner.submitted ? "text-foreground" : "text-muted-foreground"}>
                {learner.name}
              </span>
              {!learner.submitted && (
                <span className="text-[10px] text-muted-foreground ml-auto">미제출</span>
              )}
            </div>
          ))}
        </div>
      )}

      {total === 0 && (
        <p className="text-sm text-muted-foreground">
          등록된 교육생이 없습니다.
        </p>
      )}
    </div>
  );
}

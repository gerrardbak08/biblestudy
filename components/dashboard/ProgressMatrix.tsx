// components/dashboard/ProgressMatrix.tsx
// Premium leader → learner → course progress matrix
// Hero component of the dashboard — clean table with color-coded progress

import { ProgressBar } from "@/components/ui/ProgressBar";
import { Users } from "lucide-react";

interface CourseProgress {
  courseId: string;
  courseName: string;
  level: string;
  completed: number;
  total: number;
  percentage: number;
}

interface LearnerRow {
  name: string;
  totalCompleted: number;
  courses: CourseProgress[];
}

interface LeaderGroup {
  leaderName: string;
  department: string;
  learners: LearnerRow[];
}

interface CourseInfo {
  id: string;
  name: string;
  level: string;
  totalLessons: number;
}

interface ProgressMatrixProps {
  matrix: LeaderGroup[];
  courseInfo: CourseInfo[];
}

export function ProgressMatrix({ matrix, courseInfo }: ProgressMatrixProps) {
  if (matrix.length === 0) return null;

  return (
    <div className="space-y-4">
      {matrix.map((leader) => {
        const totalProgress = leader.learners.length > 0
          ? Math.round(
              leader.learners.reduce((sum, l) =>
                sum + l.courses.reduce((cs, c) => cs + c.percentage, 0) / (l.courses.length || 1),
                0
              ) / leader.learners.length
            )
          : 0;

        return (
          <div key={leader.leaderName} className="bento-card !p-0 overflow-hidden">
            {/* Leader header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-border/40">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Users className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm">{leader.leaderName}</h4>
                  <p className="text-[11px] text-muted-foreground">
                    {leader.department} · {leader.learners.length}명
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-primary tabular-nums">{totalProgress}%</p>
                <p className="text-[10px] text-muted-foreground">전체 진도</p>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/30 bg-muted/30">
                    <th className="text-left py-2.5 px-5 text-xs font-medium text-muted-foreground">교육생</th>
                    {courseInfo.map((c) => (
                      <th key={c.id} className="text-left py-2.5 px-3 text-xs font-medium text-muted-foreground min-w-[140px]">
                        <div>{c.name}</div>
                        <div className="text-[10px] font-normal opacity-60">{c.level} · {c.totalLessons}과</div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {leader.learners.map((learner, idx) => (
                    <tr
                      key={learner.name}
                      className={idx < leader.learners.length - 1 ? "border-b border-border/20" : ""}
                    >
                      <td className="py-3 px-5 font-medium text-sm">{learner.name}</td>
                      {learner.courses.map((cp) => (
                        <td key={cp.courseId} className="py-3 px-3">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 min-w-[60px]">
                              <ProgressBar percentage={cp.percentage} size="sm" showLabel={false} />
                            </div>
                            <span className="text-[11px] text-muted-foreground tabular-nums whitespace-nowrap">
                              {cp.completed}/{cp.total}
                            </span>
                          </div>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// components/dashboard/ProgressMatrix.tsx
// Leader → Learner → Course progress detail table

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProgressBar } from "@/components/ui/ProgressBar";

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
      {matrix.map((leader) => (
        <Card key={leader.leaderName}>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">
                {leader.leaderName}
                <span className="text-muted-foreground font-normal ml-2">
                  {leader.department} · {leader.learners.length}명
                </span>
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 pr-4 font-medium text-muted-foreground">교육생</th>
                    {courseInfo.map((c) => (
                      <th key={c.id} className="text-left py-2 px-2 font-medium text-muted-foreground min-w-[140px]">
                        <div className="text-xs">{c.name}</div>
                        <div className="text-[10px] text-muted-foreground/70">{c.level} · {c.totalLessons}과</div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {leader.learners.map((learner) => (
                    <tr key={learner.name} className="border-b last:border-0">
                      <td className="py-2.5 pr-4 font-medium">{learner.name}</td>
                      {learner.courses.map((cp) => (
                        <td key={cp.courseId} className="py-2.5 px-2">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 min-w-[60px]">
                              <ProgressBar percentage={cp.percentage} />
                            </div>
                            <span className="text-xs text-muted-foreground whitespace-nowrap">
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
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

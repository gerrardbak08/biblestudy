// components/dashboard/CourseProgressCards.tsx
// Bento-style course cards — prominent completion rate, clean progress

import { ProgressBar } from "@/components/ui/ProgressBar";
import { BookOpen } from "lucide-react";

interface CourseStats {
  name: string;
  level: string;
  totalLessons: number;
  lessonsWithReports: number;
  totalReports: number;
  completionRate: number;
}

export function CourseProgressCards({ courses }: { courses: CourseStats[] }) {
  if (courses.length === 0) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {courses.map((course) => (
        <div key={course.name} className="bento-card">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <BookOpen className="h-4 w-4 text-primary" />
              </div>
              <div>
                <h4 className="font-semibold text-sm">{course.name}</h4>
                <span className="text-[11px] text-muted-foreground">{course.level}</span>
              </div>
            </div>
            <span className="stat-number !text-2xl text-primary">{course.completionRate}%</span>
          </div>

          <ProgressBar percentage={course.completionRate} size="md" showLabel={false} />

          <div className="flex justify-between mt-3 text-xs text-muted-foreground">
            <span>{course.lessonsWithReports}/{course.totalLessons} 레슨</span>
            <span>보고서 {course.totalReports}건</span>
          </div>
        </div>
      ))}
    </div>
  );
}

// components/dashboard/CourseProgressCards.tsx
// Course-level progress cards — basic vs advanced overview

import { Card, CardContent } from "@/components/ui/card";
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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {courses.map((course) => (
        <Card key={course.name}>
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-primary" />
                  <h4 className="font-medium text-sm">{course.name}</h4>
                </div>
                <span className="text-xs text-muted-foreground ml-6">{course.level}</span>
              </div>
              <span className="text-lg font-semibold text-primary">{course.completionRate}%</span>
            </div>
            <ProgressBar percentage={course.completionRate} />
            <div className="flex justify-between mt-2 text-xs text-muted-foreground">
              <span>{course.lessonsWithReports}/{course.totalLessons} 레슨 진행</span>
              <span>보고서 {course.totalReports}건</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

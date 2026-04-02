// app/(dashboard)/admin/curriculum/page.tsx
// Admin: curriculum management — create form + course list

import { Header } from "@/components/layout/Header";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { CourseForm } from "@/components/forms/CourseForm";
import { DeleteButton } from "@/components/forms/DeleteButton";
import { getCurriculumList } from "@/lib/queries/curriculum";
import { deleteCourse } from "@/lib/actions/curriculum";
import Link from "next/link";
import { BookOpen } from "lucide-react";

export default async function AdminCurriculumPage() {
  const courses = await getCurriculumList();

  return (
    <>
      <Header title="커리큘럼" subtitle={`${courses.length}개 과정`} />
      <div className="p-4 md:p-8 max-w-3xl space-y-0">

        {/* Section 1: Create */}
        <section className="mb-8">
          <div className="section-header">
            <span className="section-number" aria-hidden="true">1</span>
            <h3 className="section-title">새 과정 추가</h3>
          </div>
          <div className="bento-card">
            <CourseForm />
          </div>
        </section>

        <div className="section-divider" />

        {/* Section 2: Course list */}
        <section className="mb-8">
          <div className="section-header">
            <span className="section-number" aria-hidden="true">2</span>
            <h3 className="section-title">과정 목록</h3>
          </div>

          {courses.length === 0 ? (
            <EmptyState
              icon="default"
              title="등록된 커리큘럼이 없습니다"
              description="위 폼에서 과정을 추가해주세요."
            />
          ) : (
            <div className="space-y-3">
              {courses.map((course) => {
                const totalLessons = course.sections.reduce(
                  (s, sec) => s + sec._count.lessons,
                  0
                );
                return (
                  <div key={course.id} className="bento-card">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                          <BookOpen className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <Link
                            href={`/admin/curriculum/${course.id}`}
                            className="font-semibold text-sm hover:text-primary transition-colors compact-link"
                          >
                            {course.name}
                          </Link>
                          <div className="flex items-center gap-2 mt-0.5">
                            <Badge variant="secondary" className="text-[10px]">{course.level}</Badge>
                            <span className="text-xs text-muted-foreground">
                              {course._count.sections}개 단원 · {totalLessons}개 레슨
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Link
                          href={`/admin/curriculum/${course.id}`}
                          className="text-xs text-primary hover:underline compact-link"
                        >
                          상세
                        </Link>
                        <DeleteButton
                          action={deleteCourse.bind(null, course.id)}
                          confirmMessage={`"${course.name}" 과정과 모든 단원/레슨이 삭제됩니다.`}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </>
  );
}

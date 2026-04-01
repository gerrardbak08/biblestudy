// app/(dashboard)/admin/curriculum/page.tsx
// Admin: curriculum course list with inline create form

import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { CourseForm } from "@/components/forms/CourseForm";
import { DeleteButton } from "@/components/forms/DeleteButton";
import { getCurriculumList } from "@/lib/queries/curriculum";
import { deleteCourse } from "@/lib/actions/curriculum";
import Link from "next/link";

export default async function AdminCurriculumPage() {
  const courses = await getCurriculumList();

  return (
    <>
      <Header title="커리큘럼 관리" />
      <div className="p-4 md:p-6 space-y-6 max-w-3xl">
        {/* Create form */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">새 과정 추가</CardTitle>
          </CardHeader>
          <CardContent>
            <CourseForm />
          </CardContent>
        </Card>

        {/* Course list */}
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
                <Card key={course.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Link
                          href={`/admin/curriculum/${course.id}`}
                          className="font-medium hover:underline"
                        >
                          {course.name}
                        </Link>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="secondary">{course.level}</Badge>
                          <span className="text-xs text-muted-foreground">
                            {course._count.sections}개 단원 · {totalLessons}개 레슨
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/admin/curriculum/${course.id}`}
                          className="text-xs text-primary hover:underline"
                        >
                          상세
                        </Link>
                        <DeleteButton
                          action={deleteCourse.bind(null, course.id)}
                          confirmMessage={`"${course.name}" 과정과 모든 단원/레슨이 삭제됩니다.`}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}

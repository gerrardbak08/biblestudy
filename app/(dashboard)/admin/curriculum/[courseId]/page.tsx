// app/(dashboard)/admin/curriculum/[courseId]/page.tsx
// Admin: course detail — sections and lessons tree with inline add forms

import { notFound } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BackLink } from "@/components/ui/BackLink";
import { CourseForm } from "@/components/forms/CourseForm";
import { AddSectionForm, AddLessonForm, EditSectionForm, EditLessonForm } from "@/components/forms/SectionLessonForm";
import { DeleteButton } from "@/components/forms/DeleteButton";
import { getCourseDetail } from "@/lib/queries/curriculum";
import { deleteSection, deleteLesson } from "@/lib/actions/curriculum";

export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = await params;
  const course = await getCourseDetail(courseId);
  if (!course) notFound();

  return (
    <>
      <Header title={course.name} />
      <div className="p-4 md:p-6 space-y-6 max-w-3xl">
        <BackLink href="/admin/curriculum" label="커리큘럼 목록" />

        {/* Course edit */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">과정 정보 수정</CardTitle>
          </CardHeader>
          <CardContent>
            <CourseForm
              defaultValues={{ id: course.id, name: course.name, level: course.level, order: course.order }}
              mode="edit"
            />
          </CardContent>
        </Card>

        {/* Add section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">단원 추가</CardTitle>
          </CardHeader>
          <CardContent>
            <AddSectionForm courseId={courseId} />
          </CardContent>
        </Card>

        {/* Sections + Lessons tree */}
        {course.sections.length === 0 ? (
          <p className="text-sm text-muted-foreground">등록된 단원이 없습니다.</p>
        ) : (
          course.sections.map((section) => (
            <Card key={section.id}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm">
                    {section.code}. {section.name}
                    <Badge variant="outline" className="ml-2">{section.lessons.length}개 레슨</Badge>
                  </CardTitle>
                  <DeleteButton
                    action={deleteSection.bind(null, section.id, courseId)}
                    confirmMessage={`"${section.name}" 단원과 모든 레슨이 삭제됩니다.`}
                  />
                </div>
                {/* Section edit form */}
                <EditSectionForm section={section} courseId={courseId} />
              </CardHeader>
              <CardContent className="space-y-3">
                {/* Lessons list — inline editable */}
                {section.lessons.length > 0 && (
                  <div className="space-y-2 ml-2">
                    {section.lessons.map((lesson) => (
                      <div key={lesson.id} className="flex items-center gap-2 py-1 border-b last:border-0">
                        <div className="flex-1">
                          <EditLessonForm lesson={lesson} sectionId={section.id} />
                        </div>
                        <DeleteButton
                          action={deleteLesson.bind(null, lesson.id, courseId)}
                          confirmMessage={`"${lesson.name}" 레슨을 삭제하시겠습니까?`}
                        />
                      </div>
                    ))}
                  </div>
                )}

                {/* Add lesson form */}
                <div className="pt-2 border-t">
                  <AddLessonForm sectionId={section.id} />
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </>
  );
}

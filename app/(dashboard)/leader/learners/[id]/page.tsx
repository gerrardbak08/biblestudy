// app/(dashboard)/leader/learners/[id]/page.tsx
// Learner detail — personal info + per-course progress with lesson checklist

import { auth } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { getLearnerById } from "@/lib/queries/leader";
import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getLearnerProgress } from "@/lib/progress";
import { deleteLearner } from "@/lib/actions/learner";
import { DeleteButton } from "@/components/forms/DeleteButton";
import Link from "next/link";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function LearnerDetailPage({ params }: PageProps) {
  const { id } = await params;
  const session = await auth();
  if (!session) redirect("/login");

  const learner = await getLearnerById(id);

  if (!learner) notFound();

  // Leaders can only view their own learners
  if (session.user.role === "LEADER" && learner.leaderId !== session.user.id) {
    redirect("/leader/learners");
  }

  const coursesWithProgress = await getLearnerProgress(id);

  const totalLessons = coursesWithProgress.reduce(
    (s, c) => s + c.totalLessons,
    0
  );
  const completedLessons = coursesWithProgress.reduce(
    (s, c) => s + c.completedLessons,
    0
  );
  const overallPercentage =
    totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  return (
    <>
      <Header title={`${learner.name} 상세`} />
      <div className="p-6 space-y-6 max-w-3xl">
        {/* Action buttons */}
        {session.user.role === "LEADER" && learner.leaderId === session.user.id && (
          <div className="flex gap-2">
            <Link href={`/leader/learners/${learner.id}/edit`}>
              <Button variant="outline" size="sm">수정</Button>
            </Link>
            <DeleteButton
              action={deleteLearner.bind(null, learner.id)}
              confirmMessage="교육생과 모든 보고서가 삭제됩니다. 계속하시겠습니까?"
            />
          </div>
        )}

        {/* Info card */}
        <Card>
          <CardHeader>
            <CardTitle>교육생 정보</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>
              <span className="text-muted-foreground">이름:</span>{" "}
              {learner.name}
            </p>
            <p>
              <span className="text-muted-foreground">연락처:</span>{" "}
              {learner.phone ?? "-"}
            </p>
            <p>
              <span className="text-muted-foreground">메모:</span>{" "}
              {learner.notes ?? "-"}
            </p>
            <p>
              <span className="text-muted-foreground">등록일:</span>{" "}
              {learner.createdAt.toISOString().slice(0, 10)}
            </p>
          </CardContent>
        </Card>

        {/* Overall progress */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              전체 진도
              <Badge variant="secondary">
                {completedLessons} / {totalLessons}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ProgressBar percentage={overallPercentage} />
          </CardContent>
        </Card>

        {/* Per-course progress */}
        {coursesWithProgress.map((course) => (
          <Card key={course.id}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-base">
                <span>
                  [{course.level}] {course.name}
                </span>
                <Badge variant="outline">{course.percentage}%</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {course.sections.map((section) => (
                <div key={section.id}>
                  <p className="text-sm font-medium mb-2">
                    {section.code}. {section.name}
                    <span className="text-muted-foreground ml-2">
                      ({section.completedCount}/{section.totalCount})
                    </span>
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 ml-2">
                    {section.lessons.map((lesson) => (
                      <div
                        key={lesson.id}
                        className="flex items-center gap-2 text-sm"
                      >
                        <span
                          className={
                            lesson.completed
                              ? "text-primary"
                              : "text-muted-foreground/50"
                          }
                        >
                          {lesson.completed ? "\u2713" : "\u25CB"}
                        </span>
                        <span
                          className={
                            lesson.completed
                              ? "text-foreground"
                              : "text-muted-foreground"
                          }
                        >
                          {lesson.code}. {lesson.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}

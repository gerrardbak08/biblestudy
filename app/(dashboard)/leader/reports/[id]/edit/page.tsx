// app/(dashboard)/leader/reports/[id]/edit/page.tsx
// Edit report page — leader can update their own submitted reports

import { auth } from "@/lib/auth";
import { notFound, redirect } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { ReportForm } from "@/components/forms/ReportForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getLeaderReportDetail, getReportFormData } from "@/lib/queries/leader";
import Link from "next/link";

export default async function EditReportPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();
  if (!session) redirect("/login");

  const [report, formData] = await Promise.all([
    getLeaderReportDetail(id),
    getReportFormData(session.user.id),
  ]);

  if (!report || report.leaderId !== session.user.id) notFound();

  const defaultValues = {
    id: report.id,
    learnerId: report.learnerId,
    weekDate: report.weekDate.toISOString().slice(0, 10),
    attended: report.attended ? "true" : "false",
    content: report.content,
    notes: report.notes ?? undefined,
    progressStatus: report.progressStatus ?? undefined,
    understandingLevel: report.understandingLevel,
    participationLevel: report.participationLevel,
    careLevel: report.careLevel,
    nextPlan: report.nextPlan ?? undefined,
    lessonId: report.lessonId ?? undefined,
  };

  return (
    <>
      <Header title="보고서 수정" />
      <div className="p-4 md:p-6 max-w-lg">
        <Link
          href={`/leader/reports/${id}`}
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          &larr; 돌아가기
        </Link>
        <Card className="mt-4">
          <CardHeader>
            <CardTitle>보고서 수정</CardTitle>
          </CardHeader>
          <CardContent>
            <ReportForm
              learners={formData.learners}
              lessons={formData.lessons}
              defaultValues={defaultValues}
              mode="edit"
            />
          </CardContent>
        </Card>
      </div>
    </>
  );
}

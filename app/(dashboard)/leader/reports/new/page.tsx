// app/(dashboard)/leader/reports/new/page.tsx
// Server Component — fetches the leader's learners, then renders ReportForm

import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { ReportForm } from "@/components/forms/ReportForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getReportFormData } from "@/lib/queries/leader";

export default async function NewReportPage() {
  const session = await auth();
  if (!session) redirect("/login");

  const { learners, lessons } = await getReportFormData(session.user.id);

  if (learners.length === 0) {
    return (
      <>
        <Header title="보고서 제출" />
        <div className="p-6">
          <p className="text-muted-foreground text-sm">
            보고서를 제출하려면 먼저 교육생을 등록해주세요.
          </p>
        </div>
      </>
    );
  }

  return (
    <>
      <Header title="보고서 제출" />
      <div className="p-6 max-w-lg">
        <Card>
          <CardHeader>
            <CardTitle>주간 보고서 제출</CardTitle>
          </CardHeader>
          <CardContent>
            <ReportForm learners={learners} lessons={lessons} />
          </CardContent>
        </Card>
      </div>
    </>
  );
}

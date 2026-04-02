// app/(dashboard)/leader/reports/new/page.tsx
// New report form — bento card, section header

import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { ReportForm } from "@/components/forms/ReportForm";
import { getReportFormData } from "@/lib/queries/leader";
import Link from "next/link";

export default async function NewReportPage() {
  const session = await auth();
  if (!session) redirect("/login");

  const { learners, lessons } = await getReportFormData(session.user.id);

  if (learners.length === 0) {
    return (
      <>
        <Header title="보고서 제출" />
        <div className="p-4 md:p-8 max-w-lg">
          <div className="bento-card text-center py-8">
            <p className="text-sm text-muted-foreground mb-3">
              보고서를 제출하려면 먼저 교육생을 등록해주세요.
            </p>
            <Link
              href="/leader/learners/new"
              className="text-sm text-primary font-semibold hover:underline compact-link"
            >
              교육생 등록하기 &rarr;
            </Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header title="보고서 제출" subtitle="새 보고서" />
      <div className="p-4 md:p-8 max-w-lg space-y-6">
        <div className="section-header">
          <span className="section-number" aria-hidden="true">1</span>
          <h3 className="section-title">주간 보고서 작성</h3>
        </div>
        <div className="bento-card">
          <ReportForm learners={learners} lessons={lessons} />
        </div>
      </div>
    </>
  );
}

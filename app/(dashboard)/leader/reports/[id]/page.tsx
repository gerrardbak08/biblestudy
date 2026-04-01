// app/(dashboard)/leader/reports/[id]/page.tsx
// Leader: detail view of a single study report (own reports only)

import { auth } from "@/lib/auth";
import { notFound, redirect } from "next/navigation";
import { getLeaderReportDetail } from "@/lib/queries/leader";
import { Header } from "@/components/layout/Header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LevelDisplay } from "@/components/ui/LevelDisplay";
import { BackLink } from "@/components/ui/BackLink";
import { deleteReport } from "@/lib/actions/report";
import { DeleteButton } from "@/components/forms/DeleteButton";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function LeaderReportDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();

  const report = await getLeaderReportDetail(id);

  if (!session) redirect("/login");
  if (!report || report.leaderId !== session.user.id) notFound();

  return (
    <>
      <Header title="보고서 상세" />
      <div className="p-6 max-w-2xl space-y-4">
        {/* Back link + edit/delete */}
        <div className="flex items-center justify-between">
          <BackLink href="/leader/reports" label="보고서 목록" />
          <div className="flex gap-2">
            <Link href={`/leader/reports/${report.id}/edit`}>
              <Button variant="outline" size="sm">수정</Button>
            </Link>
            <DeleteButton
              action={deleteReport.bind(null, report.id)}
              confirmMessage="이 보고서를 삭제하시겠습니까?"
            />
          </div>
        </div>

        {/* Overview card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">기본 정보</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between py-1 border-b">
              <span className="text-muted-foreground">교육생</span>
              <span className="font-medium">{report.learner.name}</span>
            </div>
            <div className="flex justify-between py-1 border-b">
              <span className="text-muted-foreground">연락처</span>
              <span>{report.learner.phone ?? "-"}</span>
            </div>
            <div className="flex justify-between py-1 border-b">
              <span className="text-muted-foreground">주차</span>
              <span>{report.weekDate.toLocaleDateString("ko-KR")}</span>
            </div>
            <div className="flex justify-between py-1 border-b">
              <span className="text-muted-foreground">출석</span>
              <Badge variant={report.attended ? "default" : "destructive"}>
                {report.attended ? "출석" : "결석"}
              </Badge>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-muted-foreground">진행 상태</span>
              <span>{report.progressStatus ?? "-"}</span>
            </div>
          </CardContent>
        </Card>

        {/* Study content card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">공부 내용</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm whitespace-pre-wrap">{report.content}</p>
          </CardContent>
        </Card>

        {/* Assessment card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">평가</CardTitle>
          </CardHeader>
          <CardContent>
            <LevelDisplay level={report.understandingLevel} label="이해도" />
            <LevelDisplay level={report.participationLevel} label="참여도" />
            <LevelDisplay level={report.careLevel} label="돌봄 수준" />
          </CardContent>
        </Card>

        {/* Notes + next plan */}
        {(report.notes || report.nextPlan) && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">메모 및 다음 계획</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {report.notes && (
                <div>
                  <p className="text-xs text-muted-foreground mb-1">메모</p>
                  <p className="text-sm whitespace-pre-wrap">{report.notes}</p>
                </div>
              )}
              {report.nextPlan && (
                <div>
                  <p className="text-xs text-muted-foreground mb-1">다음 계획</p>
                  <p className="text-sm whitespace-pre-wrap">{report.nextPlan}</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </>
  );
}

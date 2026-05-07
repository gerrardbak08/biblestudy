// app/(dashboard)/admin/reports/[id]/page.tsx
// Admin: detail view of any study report — includes leader info

import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getReportDetail } from "@/lib/queries/admin";
import { Header } from "@/components/layout/Header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LevelDisplay } from "@/components/ui/LevelDisplay";
import { BackLink } from "@/components/ui/BackLink";
import { PrintButton } from "@/components/ui/PrintButton";

export default async function AdminReportDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") redirect("/login");

  const { id } = await params;

  const report = await getReportDetail(id);

  if (!report) notFound();

  return (
    <>
      <Header title="보고서 상세" />
      <div className="p-6 max-w-2xl space-y-4">
        <div className="flex items-center justify-between print-hidden">
          <BackLink href="/admin/reports" label="전체 보고서 목록" />
          <PrintButton />
        </div>

        <div className="print-report space-y-4">
          <div className="print-only print-title-block">
            <h1>사랑과평안의교회 성경공부 보고서</h1>
            <p>출력일: {new Date().toLocaleDateString("ko-KR")}</p>
          </div>

          {/* Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">기본 정보</CardTitle>
            </CardHeader>
            <CardContent className="space-y-0 text-sm">
              <div className="flex justify-between py-1 border-b">
                <span className="text-muted-foreground">리더</span>
                <span className="font-medium">
                  {report.leader.name}
                  {report.leader.department?.name && (
                    <span className="text-muted-foreground ml-1">
                      ({report.leader.department.name})
                    </span>
                  )}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b">
                <span className="text-muted-foreground">교육생</span>
                <span className="font-medium">{report.learner.name}</span>
              </div>
              <div className="flex justify-between py-1 border-b">
                <span className="text-muted-foreground">기관</span>
                <span>{report.learner.institution ?? "-"}</span>
              </div>
              <div className="flex justify-between py-1 border-b">
                <span className="text-muted-foreground">연락처</span>
                <span>{report.learner.phone ?? "-"}</span>
              </div>
              <div className="flex justify-between py-1 border-b">
                <span className="text-muted-foreground">주차</span>
                <span>{report.weekDate.toLocaleDateString("ko-KR")}</span>
              </div>
              <div className="flex justify-between gap-4 py-1 border-b">
                <span className="text-muted-foreground shrink-0">레슨</span>
                <span className="text-right">
                  {report.lesson
                    ? `[${report.lesson.section.course.level}] ${report.lesson.section.course.name} / ${report.lesson.section.code}. ${report.lesson.section.name} / ${report.lesson.code}. ${report.lesson.name}`
                    : "-"}
                </span>
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

          {/* Study content */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">공부 내용</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm whitespace-pre-wrap">{report.content}</p>
            </CardContent>
          </Card>

          {/* Assessment */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">평가</CardTitle>
            </CardHeader>
            <CardContent>
              <LevelDisplay level={report.understandingLevel} label="이해도" />
              <LevelDisplay level={report.participationLevel} label="참여도" />
              <LevelDisplay level={report.careLevel} label="후속 돌봄 필요도" />
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

          <div className="print-only print-approval-grid" aria-label="보고 확인란">
            <div>
              <span>보고자</span>
              <strong>{report.leader.name}</strong>
              <em>서명</em>
            </div>
            <div>
              <span>셀리더 확인</span>
              <strong>&nbsp;</strong>
              <em>서명</em>
            </div>
            <div>
              <span>목회자 확인</span>
              <strong>&nbsp;</strong>
              <em>서명</em>
            </div>
          </div>

          <div className="print-only print-footer">
            <p>본 문서는 성경공부 진행 기록과 목양 관리를 위한 내부 보고서입니다.</p>
          </div>
        </div>
      </div>
    </>
  );
}

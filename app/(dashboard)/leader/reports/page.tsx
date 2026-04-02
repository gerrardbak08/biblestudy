// app/(dashboard)/leader/reports/page.tsx
// Leader: report list with pagination — bento table

import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getLeaderReports } from "@/lib/queries/leader";
import { Header } from "@/components/layout/Header";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Pagination } from "@/components/ui/Pagination";
import { EmptyState } from "@/components/ui/EmptyState";

export default async function LeaderReportsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const session = await auth();
  if (!session) redirect("/login");

  const { page: pageStr } = await searchParams;
  const currentPage = Math.max(1, parseInt(pageStr ?? "1", 10) || 1);

  const { reports, totalCount, totalPages } = await getLeaderReports(session.user.id, currentPage);

  return (
    <>
      <Header title="내 보고서" subtitle={`${totalCount}건`} />
      <div className="p-4 md:p-8 max-w-[1000px] space-y-6">
        <div className="flex items-center justify-between">
          <div className="section-header !mb-0">
            <span className="section-number" aria-hidden="true">1</span>
            <h3 className="section-title">보고서 목록</h3>
          </div>
          <Link href="/leader/reports/new">
            <Button className="gap-1.5">
              <Plus className="h-4 w-4" />
              보고서 제출
            </Button>
          </Link>
        </div>

        {reports.length === 0 ? (
          <EmptyState
            icon="reports"
            title="제출한 보고서가 없습니다"
            description="교육생의 성경공부 진행 상황을 보고서로 기록해보세요."
            actionLabel="보고서 제출"
            actionHref="/leader/reports/new"
          />
        ) : (
          <div className="bento-card !p-0 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30">
                  <TableHead>주차</TableHead>
                  <TableHead>교육생</TableHead>
                  <TableHead>내용</TableHead>
                  <TableHead>출석</TableHead>
                  <TableHead className="w-16"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reports.map((report) => (
                  <TableRow key={report.id}>
                    <TableCell className="tabular-nums">
                      {report.weekDate.toLocaleDateString("ko-KR")}
                    </TableCell>
                    <TableCell className="font-medium">{report.learner.name}</TableCell>
                    <TableCell className="max-w-xs truncate text-muted-foreground">
                      {report.content}
                    </TableCell>
                    <TableCell>
                      <Badge variant={report.attended ? "success" : "destructive"}>
                        {report.attended ? "출석" : "결석"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Link
                        href={`/leader/reports/${report.id}`}
                        className="text-xs text-primary hover:underline compact-link"
                      >
                        상세
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          basePath="/leader/reports"
        />
      </div>
    </>
  );
}

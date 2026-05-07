// app/(dashboard)/admin/reports/page.tsx
// Admin: all reports with pagination and CSV export — bento table

import { Header } from "@/components/layout/Header";
import { getAdminReports } from "@/lib/queries/admin";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Pagination } from "@/components/ui/Pagination";
import { CsvExportButton } from "@/components/ui/CsvExportButton";
import { EmptyState } from "@/components/ui/EmptyState";

export default async function AdminReportsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: pageStr } = await searchParams;
  const currentPage = Math.max(1, parseInt(pageStr ?? "1", 10) || 1);

  const { reports, totalCount, totalPages } = await getAdminReports(currentPage);

  const csvData = reports.map((r) => ({
    date: r.weekDate.toISOString().slice(0, 10),
    leader: r.leader.name,
    learner: r.learner.name,
    content: r.content,
    attended: r.attended ? "출석" : "결석",
    progressStatus: r.progressStatus ?? "",
    understandingLevel: r.understandingLevel,
    participationLevel: r.participationLevel,
    careLevel: r.careLevel,
  }));

  const csvHeaders = [
    { key: "date", label: "날짜" },
    { key: "leader", label: "리더" },
    { key: "learner", label: "교육생" },
    { key: "content", label: "내용" },
    { key: "attended", label: "출석" },
    { key: "progressStatus", label: "진행상태" },
    { key: "understandingLevel", label: "이해도" },
    { key: "participationLevel", label: "참여도" },
    { key: "careLevel", label: "후속 돌봄 필요도" },
  ];

  return (
    <>
      <Header title="전체 보고서" subtitle={`${totalCount}건`} />
      <div className="p-4 md:p-8 max-w-[1200px] space-y-6">
        <div className="flex items-center justify-between">
          <div className="section-header !mb-0">
            <span className="section-number" aria-hidden="true">1</span>
            <h3 className="section-title">보고서 목록</h3>
          </div>
          <CsvExportButton
            data={csvData}
            headers={csvHeaders}
            filename={`보고서_${new Date().toISOString().slice(0, 10)}`}
          />
        </div>

        {reports.length === 0 ? (
          <EmptyState
            icon="reports"
            title="제출된 보고서가 없습니다"
            description="리더들이 보고서를 제출하면 여기에 표시됩니다."
          />
        ) : (
          <div className="bento-card !p-0 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30">
                  <TableHead>주차</TableHead>
                  <TableHead>리더</TableHead>
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
                    <TableCell className="font-medium">{report.leader.name}</TableCell>
                    <TableCell>{report.learner.name}</TableCell>
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
                        href={`/admin/reports/${report.id}`}
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
          basePath="/admin/reports"
        />
      </div>
    </>
  );
}

// app/(dashboard)/dept/reports/page.tsx
// Dept head: department report list — bento table

import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getDeptReports } from "@/lib/queries/department";
import { Header } from "@/components/layout/Header";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";

export default async function DeptReportsPage() {
  const session = await auth();
  if (!session) redirect("/login");

  const reports = await getDeptReports(session.user.departmentId);

  return (
    <>
      <Header title="부서 보고서" subtitle={`${reports.length}건`} />
      <div className="p-4 md:p-8 max-w-[1200px] space-y-6">
        <div className="section-header">
          <span className="section-number" aria-hidden="true">1</span>
          <h3 className="section-title">최근 보고서</h3>
        </div>

        {reports.length === 0 ? (
          <p className="text-sm text-muted-foreground">등록된 보고서가 없습니다.</p>
        ) : (
          <div className="bento-card !p-0 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30">
                  <TableHead>날짜</TableHead>
                  <TableHead>진행자</TableHead>
                  <TableHead>교육생</TableHead>
                  <TableHead>레슨</TableHead>
                  <TableHead>출석</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reports.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell className="tabular-nums">
                      {r.weekDate.toISOString().slice(0, 10)}
                    </TableCell>
                    <TableCell className="font-medium">{r.leader.name}</TableCell>
                    <TableCell>{r.learner.name}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {r.lesson
                        ? `${r.lesson.code}. ${r.lesson.name}`
                        : "-"}
                    </TableCell>
                    <TableCell>
                      <Badge variant={r.attended ? "success" : "destructive"}>
                        {r.attended ? "출석" : "결석"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </>
  );
}

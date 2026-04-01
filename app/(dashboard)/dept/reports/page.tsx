// app/(dashboard)/dept/reports/page.tsx
// Lists all study reports within the department

import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getDeptReports } from "@/lib/queries/department";
import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default async function DeptReportsPage() {
  const session = await auth();
  if (!session) redirect("/login");
  const departmentId = session.user.departmentId;

  const reports = await getDeptReports(departmentId);

  return (
    <>
      <Header title="부서 보고서" />
      <div className="p-6">
        <Card>
          <CardHeader>
            <CardTitle>최근 보고서</CardTitle>
          </CardHeader>
          <CardContent>
            {reports.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                등록된 보고서가 없습니다.
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
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
                      <TableCell>
                        {r.weekDate.toISOString().slice(0, 10)}
                      </TableCell>
                      <TableCell>{r.leader.name}</TableCell>
                      <TableCell>{r.learner.name}</TableCell>
                      <TableCell>
                        {r.lesson
                          ? `${r.lesson.code}. ${r.lesson.name}`
                          : "-"}
                      </TableCell>
                      <TableCell>{r.attended ? "출석" : "결석"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}

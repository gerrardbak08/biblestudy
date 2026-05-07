// app/(dashboard)/dept/leaders/page.tsx
// Dept head: leader list — bento table

import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getDeptLeaders } from "@/lib/queries/department";
import { Header } from "@/components/layout/Header";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";

export default async function DeptLeadersPage() {
  const session = await auth();
  if (!session) redirect("/login");

  const leaders = await getDeptLeaders(session.user.departmentId);

  return (
    <>
      <Header title="부서 리더" subtitle={`${leaders.length}명`} />
      <div className="p-4 md:p-8 max-w-[1200px] space-y-6">
        <div className="section-header">
          <span className="section-number" aria-hidden="true">1</span>
          <h3 className="section-title">리더 목록</h3>
        </div>

        {leaders.length === 0 ? (
          <p className="text-sm text-muted-foreground">등록된 리더가 없습니다.</p>
        ) : (
          <div className="bento-card !p-0 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30">
                  <TableHead>이름</TableHead>
                  <TableHead>아이디</TableHead>
                  <TableHead>연락처</TableHead>
                  <TableHead>교육생</TableHead>
                  <TableHead>이번 주</TableHead>
                  <TableHead>보고서</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leaders.map((leader) => {
                  const hasLearners = leader._count.learners > 0;
                  const statusLabel = !hasLearners
                    ? "교육생 없음"
                    : leader.submittedThisWeek
                      ? "제출완료"
                      : "미제출";
                  const statusVariant = !hasLearners
                    ? "outline"
                    : leader.submittedThisWeek
                      ? "success"
                      : "warning";

                  return (
                    <TableRow key={leader.id}>
                      <TableCell className="font-medium">{leader.name}</TableCell>
                      <TableCell className="text-muted-foreground">{leader.loginId}</TableCell>
                      <TableCell>{leader.phone ?? "-"}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{leader._count.learners}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={statusVariant}>{statusLabel}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{leader._count.reports}</Badge>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </>
  );
}

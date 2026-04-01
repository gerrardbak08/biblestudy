// app/(dashboard)/dept/leaders/page.tsx
// Lists all leaders in the department head's department

import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getDeptLeaders } from "@/lib/queries/department";
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

export default async function DeptLeadersPage() {
  const session = await auth();
  if (!session) redirect("/login");
  const departmentId = session.user.departmentId;

  const leaders = await getDeptLeaders(departmentId);

  return (
    <>
      <Header title="부서 리더 관리" />
      <div className="p-6">
        <Card>
          <CardHeader>
            <CardTitle>리더 목록</CardTitle>
          </CardHeader>
          <CardContent>
            {leaders.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                등록된 리더가 없습니다.
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>이름</TableHead>
                    <TableHead>이메일</TableHead>
                    <TableHead>연락처</TableHead>
                    <TableHead>교육생</TableHead>
                    <TableHead>보고서</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {leaders.map((leader) => (
                    <TableRow key={leader.id}>
                      <TableCell className="font-medium">
                        {leader.name}
                      </TableCell>
                      <TableCell>{leader.email}</TableCell>
                      <TableCell>{leader.phone ?? "-"}</TableCell>
                      <TableCell>{leader._count.learners}</TableCell>
                      <TableCell>{leader._count.reports}</TableCell>
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

// app/(dashboard)/dept/progress/page.tsx
// Department-level curriculum progress overview

import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { getProgressStats } from "@/lib/progress";

export default async function DeptProgressPage() {
  const session = await auth();
  if (!session) redirect("/login");
  const { learnerProgress, totalLessons, avgPercentage } =
    await getProgressStats(session.user.departmentId);

  return (
    <>
      <Header title="부서 진도 현황" />
      <div className="p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">
                전체 레슨 수
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{totalLessons}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">
                교육생 수
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{learnerProgress.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">
                평균 진도율
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{avgPercentage}%</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>교육생별 진도</CardTitle>
          </CardHeader>
          <CardContent>
            {learnerProgress.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                교육생이 없습니다.
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>교육생</TableHead>
                    <TableHead>진행자</TableHead>
                    <TableHead>완료</TableHead>
                    <TableHead className="w-48">진도</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {learnerProgress.map((l) => (
                    <TableRow key={l.id}>
                      <TableCell className="font-medium">{l.name}</TableCell>
                      <TableCell>{l.leaderName}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          {l.completedLessons} / {l.totalLessons}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <ProgressBar percentage={l.percentage} />
                      </TableCell>
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

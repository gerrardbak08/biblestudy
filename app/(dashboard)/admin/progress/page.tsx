// app/(dashboard)/admin/progress/page.tsx
// Admin (pastor) view — full curriculum progress across all departments

import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { StatCard } from "@/components/dashboard/StatCard";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { getAdminProgressData } from "@/lib/queries/admin";
import { BookOpen, Users, TrendingUp } from "lucide-react";

export default async function AdminProgressPage() {
  const { overall, deptStats } = await getAdminProgressData();

  return (
    <>
      <Header title="전체 진도 현황" />
      <div className="p-6 space-y-6">
        {/* Overall summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard label="전체 레슨" value={overall.totalLessons} icon={BookOpen} iconColor="text-blue-600 dark:text-blue-400" />
          <StatCard label="전체 교육생" value={overall.learnerProgress.length} icon={Users} iconColor="text-emerald-600 dark:text-emerald-400" />
          <StatCard label="전체 평균 진도율" value={`${overall.avgPercentage}%`} icon={TrendingUp} iconColor="text-purple-600 dark:text-purple-400" />
        </div>

        {/* Per-department summary */}
        <Card>
          <CardHeader>
            <CardTitle>부서별 진도</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>부서</TableHead>
                  <TableHead>인원</TableHead>
                  <TableHead>교육생</TableHead>
                  <TableHead className="w-48">평균 진도</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {deptStats.map((dept) => (
                  <TableRow key={dept.id}>
                    <TableCell className="font-medium">{dept.name}</TableCell>
                    <TableCell>{dept.memberCount}</TableCell>
                    <TableCell>{dept.learnerCount}</TableCell>
                    <TableCell>
                      <ProgressBar percentage={dept.avgPercentage} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Individual learner progress */}
        <Card>
          <CardHeader>
            <CardTitle>교육생별 진도</CardTitle>
          </CardHeader>
          <CardContent>
            {overall.learnerProgress.length === 0 ? (
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
                  {overall.learnerProgress.map((l) => (
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

// app/(dashboard)/dept/progress/page.tsx
// Department progress — stats + learner table

import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { StatCard } from "@/components/dashboard/StatCard";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { getProgressStats } from "@/lib/progress";
import { BookOpen, Users, TrendingUp } from "lucide-react";

export default async function DeptProgressPage() {
  const session = await auth();
  if (!session) redirect("/login");
  const { learnerProgress, totalLessons, avgPercentage } =
    await getProgressStats(session.user.departmentId);

  return (
    <>
      <Header title="진도 현황" subtitle="부서" />
      <div className="p-4 md:p-8 max-w-[1200px] space-y-0">

        {/* Section 1: Stats */}
        <section className="mb-8">
          <div className="section-header">
            <span className="section-number" aria-hidden="true">1</span>
            <h3 className="section-title">전체 요약</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 stagger-children">
            <StatCard label="전체 레슨" value={totalLessons} icon={BookOpen} iconColor="text-blue-600" />
            <StatCard label="교육생" value={learnerProgress.length} icon={Users} iconColor="text-emerald-600" />
            <StatCard label="평균 진도" value={`${avgPercentage}%`} icon={TrendingUp} iconColor="text-violet-600" />
          </div>
        </section>

        <div className="section-divider" />

        {/* Section 2: Learner detail */}
        <section className="mb-8">
          <div className="section-header">
            <span className="section-number" aria-hidden="true">2</span>
            <h3 className="section-title">교육생별 진도</h3>
          </div>
          {learnerProgress.length === 0 ? (
            <p className="text-sm text-muted-foreground">교육생이 없습니다.</p>
          ) : (
            <div className="bento-card !p-0 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30">
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
                      <TableCell className="text-muted-foreground">{l.leaderName}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          {l.completedLessons} / {l.totalLessons}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <ProgressBar percentage={l.percentage} size="md" />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </section>
      </div>
    </>
  );
}

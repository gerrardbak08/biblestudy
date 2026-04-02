// app/(dashboard)/admin/progress/page.tsx
// Admin: full curriculum progress — stats + dept table + learner table

import { Header } from "@/components/layout/Header";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { StatCard } from "@/components/dashboard/StatCard";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { getAdminProgressData } from "@/lib/queries/admin";
import { BookOpen, Users, TrendingUp } from "lucide-react";

export default async function AdminProgressPage() {
  const { overall, deptStats } = await getAdminProgressData();

  return (
    <>
      <Header title="진도 현황" subtitle="전체" />
      <div className="p-4 md:p-8 max-w-[1200px] space-y-0">

        {/* Section 1: KPI */}
        <section className="mb-8">
          <div className="section-header">
            <span className="section-number" aria-hidden="true">1</span>
            <h3 className="section-title">전체 요약</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 stagger-children">
            <StatCard label="전체 레슨" value={overall.totalLessons} icon={BookOpen} iconColor="text-blue-600" />
            <StatCard label="전체 교육생" value={overall.learnerProgress.length} icon={Users} iconColor="text-emerald-600" />
            <StatCard label="전체 평균 진도" value={`${overall.avgPercentage}%`} icon={TrendingUp} iconColor="text-violet-600" />
          </div>
        </section>

        <div className="section-divider" />

        {/* Section 2: Dept summary */}
        <section className="mb-8">
          <div className="section-header">
            <span className="section-number" aria-hidden="true">2</span>
            <h3 className="section-title">부서별 진도</h3>
          </div>
          <div className="bento-card !p-0 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30">
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
                      <ProgressBar percentage={dept.avgPercentage} size="md" />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </section>

        <div className="section-divider" />

        {/* Section 3: Learner detail */}
        <section className="mb-8">
          <div className="section-header">
            <span className="section-number" aria-hidden="true">3</span>
            <h3 className="section-title">교육생별 진도</h3>
          </div>
          {overall.learnerProgress.length === 0 ? (
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
                  {overall.learnerProgress.map((l) => (
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

// app/(dashboard)/dept/page.tsx
// Department head dashboard — hero headline, stats, weekly chart

import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { StatCard } from "@/components/dashboard/StatCard";
import { WeeklyReportChart } from "@/components/charts/WeeklyReportChart";
import { getDeptDashboard } from "@/lib/queries/department";
import { Users, GraduationCap, FileText, TrendingUp } from "lucide-react";

export default async function DeptDashboardPage() {
  const session = await auth();
  if (!session) redirect("/login");

  const { department, totalLeaders, totalLearners, totalReports, progress, weeklyData } =
    await getDeptDashboard(session.user.departmentId);

  return (
    <>
      <Header title="대시보드" subtitle={department?.name ?? "부서"} />
      <div className="p-4 md:p-8 max-w-[1200px] space-y-0">

        {/* Hero */}
        <section className="mb-8 animate-fade-up">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
            {department?.name ?? "부서"} 교육 현황을
            <span className="text-primary"> 한눈에</span>
          </h2>
          <p className="text-sm text-muted-foreground mt-2">
            부서 내 진행자·교육생·보고서 현황을 실시간으로 확인합니다.
          </p>
        </section>

        {/* Section 1: KPI */}
        <section className="mb-8">
          <div className="section-header">
            <span className="section-number" aria-hidden="true">1</span>
            <h3 className="section-title">핵심 지표</h3>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 stagger-children">
            <StatCard label="진행자" value={totalLeaders} icon={Users} iconColor="text-blue-600" />
            <StatCard label="교육생" value={totalLearners} icon={GraduationCap} iconColor="text-emerald-600" />
            <StatCard label="보고서" value={totalReports} icon={FileText} iconColor="text-amber-600" />
            <StatCard label="평균 진도" value={`${progress.avgPercentage}%`} icon={TrendingUp} iconColor="text-violet-600" />
          </div>
        </section>

        <div className="section-divider" />

        {/* Section 2: Weekly chart */}
        <section className="mb-8">
          <div className="section-header">
            <span className="section-number" aria-hidden="true">2</span>
            <h3 className="section-title">주간 보고서 제출 현황</h3>
          </div>
          <div className="bento-card">
            <WeeklyReportChart data={weeklyData} />
          </div>
        </section>
      </div>
    </>
  );
}

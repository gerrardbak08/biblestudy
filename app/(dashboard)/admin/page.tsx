// app/(dashboard)/admin/page.tsx
// Admin dashboard — overview stats + weekly report chart + department comparison

import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCard } from "@/components/dashboard/StatCard";
import { WeeklyReportChart } from "@/components/charts/WeeklyReportChart";
import { DeptComparisonChart } from "@/components/charts/DeptComparisonChart";
import { Users, GraduationCap, FileText, TrendingUp } from "lucide-react";
import { getAdminDashboardData } from "@/lib/queries/admin";

export default async function AdminDashboardPage() {
  const { totalLeaders, totalLearners, totalReports, progress, weeklyData, deptData } =
    await getAdminDashboardData();

  return (
    <>
      <Header title="목회자 대시보드" />
      <div className="p-6 space-y-6">
        {/* Stats cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard label="전체 진행자" value={totalLeaders} icon={Users} iconColor="text-blue-600 dark:text-blue-400" />
          <StatCard label="전체 교육생" value={totalLearners} icon={GraduationCap} iconColor="text-emerald-600 dark:text-emerald-400" />
          <StatCard label="전체 보고서" value={totalReports} icon={FileText} iconColor="text-amber-600 dark:text-amber-400" />
          <StatCard label="평균 진도율" value={`${progress.avgPercentage}%`} icon={TrendingUp} iconColor="text-purple-600 dark:text-purple-400" />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">주간 보고서 제출 현황</CardTitle>
            </CardHeader>
            <CardContent>
              <WeeklyReportChart data={weeklyData} />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">부서별 현황</CardTitle>
            </CardHeader>
            <CardContent>
              <DeptComparisonChart data={deptData} />
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}


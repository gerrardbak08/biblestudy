// app/(dashboard)/dept/page.tsx
// Department head dashboard — stats + weekly report chart

import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
      <Header title={`${department?.name ?? "부서"} 대시보드`} />
      <div className="p-4 md:p-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard label="진행자 수" value={totalLeaders} icon={Users} iconColor="text-blue-600 dark:text-blue-400" />
          <StatCard label="교육생 수" value={totalLearners} icon={GraduationCap} iconColor="text-emerald-600 dark:text-emerald-400" />
          <StatCard label="총 보고서" value={totalReports} icon={FileText} iconColor="text-amber-600 dark:text-amber-400" />
          <StatCard label="평균 진도율" value={`${progress.avgPercentage}%`} icon={TrendingUp} iconColor="text-purple-600 dark:text-purple-400" />
        </div>

        {/* Weekly chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">주간 보고서 제출 현황</CardTitle>
          </CardHeader>
          <CardContent>
            <WeeklyReportChart data={weeklyData} />
          </CardContent>
        </Card>
      </div>
    </>
  );
}

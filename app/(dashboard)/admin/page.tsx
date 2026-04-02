// app/(dashboard)/admin/page.tsx
// Admin dashboard — comprehensive monitoring hub

import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCard } from "@/components/dashboard/StatCard";
import { WeeklyReportChart } from "@/components/charts/WeeklyReportChart";
import { DeptComparisonChart } from "@/components/charts/DeptComparisonChart";
import { MonthlyTrendChart } from "@/components/charts/MonthlyTrendChart";
import { CourseProgressCards } from "@/components/dashboard/CourseProgressCards";
import { MissingReportAlert } from "@/components/dashboard/MissingReportAlert";
import { ProgressMatrix } from "@/components/dashboard/ProgressMatrix";
import { Users, GraduationCap, FileText, TrendingUp } from "lucide-react";
import { getAdminDashboardData, getLeaderLearnerProgressMatrix } from "@/lib/queries/admin";

export default async function AdminDashboardPage() {
  const [dashData, progressData] = await Promise.all([
    getAdminDashboardData(),
    getLeaderLearnerProgressMatrix(),
  ]);

  const {
    totalLeaders, totalLearners, totalReports, progress,
    weeklyData, monthlyData, deptData, courseStats, missingLeaders,
  } = dashData;
  const { matrix, courseInfo } = progressData;

  return (
    <>
      <Header title="대시보드" />
      <div className="p-4 md:p-6 space-y-6">
        {/* Missing report alert */}
        {missingLeaders.length > 0 && (
          <MissingReportAlert leaders={missingLeaders} />
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <StatCard label="진행자" value={totalLeaders} icon={Users} iconColor="text-blue-600" />
          <StatCard label="교육생" value={totalLearners} icon={GraduationCap} iconColor="text-emerald-600" />
          <StatCard label="보고서" value={totalReports} icon={FileText} iconColor="text-amber-600" />
          <StatCard label="평균 진도" value={`${progress.avgPercentage}%`} icon={TrendingUp} iconColor="text-violet-600" />
        </div>

        {/* Course progress */}
        <div>
          <h3 className="text-sm font-medium mb-3">과정별 진행 현황</h3>
          <CourseProgressCards courses={courseStats} />
        </div>

        {/* Charts row 1: Weekly + Monthly trend */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">주간 보고서 제출</CardTitle>
            </CardHeader>
            <CardContent>
              <WeeklyReportChart data={weeklyData} />
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">월별 추이 (12개월)</CardTitle>
            </CardHeader>
            <CardContent>
              <MonthlyTrendChart data={monthlyData} />
            </CardContent>
          </Card>
        </div>

        {/* Charts row 2: Department comparison */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">부서별 현황</CardTitle>
          </CardHeader>
          <CardContent>
            <DeptComparisonChart data={deptData} />
          </CardContent>
        </Card>

        {/* Leader → Learner → Course progress matrix */}
        <div>
          <h3 className="text-sm font-medium mb-3">인도자별 교육 현황</h3>
          <p className="text-xs text-muted-foreground mb-4">
            각 인도자가 담당하는 교육생과 과정별 진도를 한눈에 확인합니다.
          </p>
          <ProgressMatrix matrix={matrix} courseInfo={courseInfo} />
        </div>
      </div>
    </>
  );
}

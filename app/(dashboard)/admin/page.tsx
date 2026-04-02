// app/(dashboard)/admin/page.tsx
// Admin dashboard — hero headline, numbered sections, trust elements, Bento Grid

import { Header } from "@/components/layout/Header";
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
      <Header title="대시보드" subtitle="종합 현황" />
      <div className="p-4 md:p-8 max-w-[1400px] space-y-0">

        {/* ── Hero headline ── designbase/tenet: 5초 안에 핵심 가치 전달 */}
        <section className="mb-8 animate-fade-up" aria-labelledby="hero-title">
          <h2 id="hero-title" className="text-2xl md:text-3xl font-bold tracking-tight">
            성경공부 교육 현황을
            <br className="sm:hidden" />
            <span className="text-primary"> 한눈에</span> 파악하세요
          </h2>
          <p className="text-sm text-muted-foreground mt-2 max-w-lg">
            인도자별 교육 진도, 보고서 제출 현황, 과정 완료율을 실시간으로 확인하고 관리합니다.
          </p>
        </section>

        {/* ── Alert: 미제출 리더 (있을 때만) ── */}
        {missingLeaders.length > 0 && (
          <div className="mb-6 animate-fade-up" style={{ animationDelay: "60ms" }}>
            <MissingReportAlert leaders={missingLeaders} />
          </div>
        )}

        {/* ── Section 1: KPI ── */}
        <section className="mb-8" aria-labelledby="section-kpi">
          <div className="section-header animate-fade-up" style={{ animationDelay: "100ms" }}>
            <span className="section-number" aria-hidden="true">1</span>
            <div>
              <h3 id="section-kpi" className="section-title">핵심 지표</h3>
              <p className="section-desc">전체 교육 현황 요약</p>
            </div>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 stagger-children">
            <StatCard label="진행자" value={totalLeaders} icon={Users} iconColor="text-blue-600" />
            <StatCard label="교육생" value={totalLearners} icon={GraduationCap} iconColor="text-emerald-600" />
            <StatCard label="보고서" value={totalReports} icon={FileText} iconColor="text-amber-600" />
            <StatCard label="평균 진도" value={`${progress.avgPercentage}%`} icon={TrendingUp} iconColor="text-violet-600" />
          </div>
        </section>

        <div className="section-divider" />

        {/* ── Section 2: 인도자별 교육 현황 (Hero content) ── */}
        <section className="mb-8" aria-labelledby="section-matrix">
          <div className="section-header animate-fade-up">
            <span className="section-number" aria-hidden="true">2</span>
            <div>
              <h3 id="section-matrix" className="section-title">인도자별 교육 현황</h3>
              <p className="section-desc">각 인도자의 교육생과 과정별 진도를 한눈에 확인</p>
            </div>
          </div>
          <ProgressMatrix matrix={matrix} courseInfo={courseInfo} />
        </section>

        <div className="section-divider" />

        {/* ── Section 3: 과정별 진행 ── */}
        <section className="mb-8" aria-labelledby="section-courses">
          <div className="section-header animate-fade-up">
            <span className="section-number" aria-hidden="true">3</span>
            <div>
              <h3 id="section-courses" className="section-title">과정별 진행 현황</h3>
              <p className="section-desc">각 과정의 완료율과 보고서 현황</p>
            </div>
          </div>
          <CourseProgressCards courses={courseStats} />
        </section>

        <div className="section-divider" />

        {/* ── Section 4: 추이 분석 ── */}
        <section className="mb-8" aria-labelledby="section-trends">
          <div className="section-header animate-fade-up">
            <span className="section-number" aria-hidden="true">4</span>
            <div>
              <h3 id="section-trends" className="section-title">추이 분석</h3>
              <p className="section-desc">주간·월별 보고서 제출 추이</p>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="bento-card">
              <h4 className="text-sm font-semibold mb-4">주간 보고서 제출</h4>
              <WeeklyReportChart data={weeklyData} />
            </div>
            <div className="bento-card">
              <h4 className="text-sm font-semibold mb-4">월별 추이 (12개월)</h4>
              <MonthlyTrendChart data={monthlyData} />
            </div>
          </div>
        </section>

        <div className="section-divider" />

        {/* ── Section 5: 부서별 현황 ── */}
        <section className="mb-8" aria-labelledby="section-dept">
          <div className="section-header animate-fade-up">
            <span className="section-number" aria-hidden="true">5</span>
            <div>
              <h3 id="section-dept" className="section-title">부서별 현황</h3>
              <p className="section-desc">부서 간 진행자·교육생·보고서 비교</p>
            </div>
          </div>
          <div className="bento-card">
            <DeptComparisonChart data={deptData} />
          </div>
        </section>

        {/* Trust element: last updated */}
        <footer className="text-center py-4">
          <p className="text-[11px] text-muted-foreground/60">
            데이터는 페이지 로드 시점 기준입니다
          </p>
        </footer>
      </div>
    </>
  );
}

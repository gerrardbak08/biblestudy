// app/(dashboard)/leader/page.tsx
// Leader dashboard — strong CTA flow, headline, weekly progress

import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { WeeklyProgress } from "@/components/dashboard/WeeklyProgress";
import { getLeaderDashboard } from "@/lib/queries/leader";
import { Button } from "@/components/ui/button";
import { PenLine } from "lucide-react";
import Link from "next/link";

export default async function LeaderDashboardPage() {
  const session = await auth();
  if (!session) redirect("/login");

  const { learnerStatuses, totalReports } = await getLeaderDashboard(session.user.id);

  const submitted = learnerStatuses.filter((l) => l.submitted).length;
  const total = learnerStatuses.length;

  return (
    <>
      <Header title="대시보드" subtitle={`${session.user.name} 진행자`} />
      <div className="p-4 md:p-8 space-y-0 max-w-3xl">

        {/* ── Hero: Greeting + primary CTA ── */}
        <section className="mb-8 animate-fade-up" aria-labelledby="hero-greeting">
          <h2 id="hero-greeting" className="text-2xl md:text-3xl font-bold tracking-tight">
            안녕하세요,
            <br className="sm:hidden" />
            <span className="text-primary"> {session.user.name}</span> 진행자님
          </h2>
          <p className="text-sm text-muted-foreground mt-2 mb-5">
            {total > 0
              ? `이번 주 ${submitted}/${total}명 교육생이 보고서를 제출했습니다.`
              : "이번 주 성경공부 보고서를 제출해주세요."
            }
          </p>
          <Link href="/leader/reports/new">
            <Button size="lg" className="gap-2">
              <PenLine className="h-4 w-4" />
              보고서 제출하기
            </Button>
          </Link>
        </section>

        <div className="section-divider" />

        {/* ── Quick actions ── */}
        <section className="mb-8 animate-fade-up" style={{ animationDelay: "100ms" }}>
          <div className="section-header">
            <span className="section-number" aria-hidden="true">1</span>
            <h3 className="section-title">빠른 실행</h3>
          </div>
          <QuickActions />
        </section>

        <div className="section-divider" />

        {/* ── Weekly progress ── */}
        <section className="mb-8 animate-fade-up" style={{ animationDelay: "200ms" }}>
          <div className="section-header">
            <span className="section-number" aria-hidden="true">2</span>
            <h3 className="section-title">이번 주 현황</h3>
          </div>
          <WeeklyProgress
            learners={learnerStatuses}
            totalReports={totalReports}
          />
        </section>
      </div>
    </>
  );
}

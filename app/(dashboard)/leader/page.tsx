// app/(dashboard)/leader/page.tsx
// Leader dashboard — greeting, quick actions, weekly progress

import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { WeeklyProgress } from "@/components/dashboard/WeeklyProgress";
import { getLeaderDashboard } from "@/lib/queries/leader";

export default async function LeaderDashboardPage() {
  const session = await auth();
  if (!session) redirect("/login");

  const { learnerStatuses, totalReports } = await getLeaderDashboard(session.user.id);

  return (
    <>
      <Header title="대시보드" />
      <div className="p-4 md:p-6 space-y-5 max-w-3xl">
        {/* Greeting */}
        <div className="space-y-1">
          <h2 className="text-lg font-semibold font-serif">
            안녕하세요, {session.user.name} 진행자님
          </h2>
          <p className="text-sm text-muted-foreground">
            이번 주 성경공부 보고서를 제출해주세요.
          </p>
        </div>

        {/* Quick actions */}
        <QuickActions />

        {/* Weekly progress */}
        <WeeklyProgress
          learners={learnerStatuses}
          totalReports={totalReports}
        />
      </div>
    </>
  );
}

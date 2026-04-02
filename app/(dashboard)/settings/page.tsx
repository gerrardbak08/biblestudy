// app/(dashboard)/settings/page.tsx
// Settings — user info + password change in bento cards

import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { ChangePasswordForm } from "@/components/forms/ChangePasswordForm";

const roleLabel: Record<string, string> = {
  ADMIN: "목회자",
  DEPT_HEAD: "기관장",
  LEADER: "진행자",
};

export default async function SettingsPage() {
  const session = await auth();
  if (!session) redirect("/login");

  return (
    <>
      <Header title="설정" />
      <div className="p-4 md:p-8 max-w-lg space-y-0">

        {/* Section 1: Profile */}
        <section className="mb-8">
          <div className="section-header">
            <span className="section-number" aria-hidden="true">1</span>
            <h3 className="section-title">내 정보</h3>
          </div>
          <div className="bento-card space-y-0">
            <div className="flex justify-between py-3 border-b border-border/30">
              <span className="text-sm text-muted-foreground">이름</span>
              <span className="text-sm font-medium">{session.user.name}</span>
            </div>
            <div className="flex justify-between py-3 border-b border-border/30">
              <span className="text-sm text-muted-foreground">아이디</span>
              <span className="text-sm">{session.user.email}</span>
            </div>
            <div className="flex justify-between py-3">
              <span className="text-sm text-muted-foreground">역할</span>
              <span className="text-sm font-medium">{roleLabel[session.user.role] ?? session.user.role}</span>
            </div>
          </div>
        </section>

        <div className="section-divider" />

        {/* Section 2: Password */}
        <section className="mb-8">
          <div className="section-header">
            <span className="section-number" aria-hidden="true">2</span>
            <h3 className="section-title">비밀번호 변경</h3>
          </div>
          <div className="bento-card">
            <ChangePasswordForm />
          </div>
        </section>
      </div>
    </>
  );
}

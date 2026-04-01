// app/(dashboard)/settings/page.tsx
// Settings page — password change for all authenticated users

import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChangePasswordForm } from "@/components/forms/ChangePasswordForm";

export default async function SettingsPage() {
  const session = await auth();
  if (!session) redirect("/login");

  return (
    <>
      <Header title="설정" />
      <div className="p-6 max-w-lg space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>내 정보</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between py-1 border-b">
              <span className="text-muted-foreground">이름</span>
              <span className="font-medium">{session.user.name}</span>
            </div>
            <div className="flex justify-between py-1 border-b">
              <span className="text-muted-foreground">이메일</span>
              <span>{session.user.email}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-muted-foreground">역할</span>
              <span>{session.user.role}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>비밀번호 변경</CardTitle>
          </CardHeader>
          <CardContent>
            <ChangePasswordForm />
          </CardContent>
        </Card>
      </div>
    </>
  );
}

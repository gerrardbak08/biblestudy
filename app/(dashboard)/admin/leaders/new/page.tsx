// app/(dashboard)/admin/leaders/new/page.tsx
// Admin: create a new leader account — fetches departments for dropdown

import { prisma } from "@/lib/prisma";
import { Header } from "@/components/layout/Header";
import { CreateLeaderForm } from "@/components/forms/CreateLeaderForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function NewLeaderPage() {
  const departments = await prisma.department.findMany({
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });

  return (
    <>
      <Header title="보조 리더 등록" subtitle="일반 운영은 리더 자가 가입을 사용합니다" />
      <div className="p-6 max-w-md">
        <Card>
          <CardHeader>
            <CardTitle>관리자 보조 등록</CardTitle>
          </CardHeader>
          <CardContent>
            <CreateLeaderForm departments={departments} />
          </CardContent>
        </Card>
      </div>
    </>
  );
}

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
      <Header title="리더 추가" />
      <div className="p-6 max-w-md">
        <Card>
          <CardHeader>
            <CardTitle>새 리더 계정 생성</CardTitle>
          </CardHeader>
          <CardContent>
            <CreateLeaderForm departments={departments} />
          </CardContent>
        </Card>
      </div>
    </>
  );
}

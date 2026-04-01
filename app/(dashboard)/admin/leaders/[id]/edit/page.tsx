// app/(dashboard)/admin/leaders/[id]/edit/page.tsx
// Admin: edit leader details, reset password, delete account

import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BackLink } from "@/components/ui/BackLink";
import { EditLeaderForm } from "@/components/forms/EditLeaderForm";
import { DeleteButton } from "@/components/forms/DeleteButton";
import { deleteLeader } from "@/lib/actions/leader";

export default async function EditLeaderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [leader, departments] = await Promise.all([
    prisma.user.findUnique({
      where: { id },
      select: { id: true, name: true, email: true, phone: true, role: true, departmentId: true },
    }),
    prisma.department.findMany({
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    }),
  ]);

  if (!leader || leader.role === "ADMIN") notFound();

  return (
    <>
      <Header title="리더 수정" />
      <div className="p-4 md:p-6 max-w-lg">
        <BackLink href="/admin/leaders" label="리더 목록" />
        <Card className="mt-4">
          <CardHeader>
            <CardTitle className="text-base">{leader.name} 정보 수정</CardTitle>
          </CardHeader>
          <CardContent>
            <EditLeaderForm leader={leader} departments={departments} />
          </CardContent>
        </Card>

        <div className="mt-4">
          <DeleteButton
            action={deleteLeader.bind(null, leader.id)}
            confirmMessage={`"${leader.name}" 계정과 모든 학습자/보고서가 삭제됩니다. 계속하시겠습니까?`}
          />
        </div>
      </div>
    </>
  );
}

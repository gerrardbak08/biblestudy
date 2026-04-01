// app/(dashboard)/admin/departments/[id]/edit/page.tsx
// Admin: edit department name

import { notFound } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BackLink } from "@/components/ui/BackLink";
import { DepartmentForm } from "@/components/forms/DepartmentForm";
import { getDepartmentByIdAdmin } from "@/lib/queries/department-admin";

export default async function EditDepartmentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const department = await getDepartmentByIdAdmin(id);
  if (!department) notFound();

  return (
    <>
      <Header title="부서 수정" />
      <div className="p-4 md:p-6 max-w-lg">
        <BackLink href="/admin/departments" label="부서 목록" />
        <Card className="mt-4">
          <CardHeader>
            <CardTitle className="text-base">부서 정보 수정</CardTitle>
          </CardHeader>
          <CardContent>
            <DepartmentForm
              defaultValues={{ id: department.id, name: department.name }}
              mode="edit"
            />
          </CardContent>
        </Card>
      </div>
    </>
  );
}

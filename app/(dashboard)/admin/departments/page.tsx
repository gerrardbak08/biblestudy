// app/(dashboard)/admin/departments/page.tsx
// Admin: department list with create form and edit/delete actions

import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/EmptyState";
import { DepartmentForm } from "@/components/forms/DepartmentForm";
import { DeleteButton } from "@/components/forms/DeleteButton";
import { getAdminDepartments } from "@/lib/queries/department-admin";
import { deleteDepartment } from "@/lib/actions/department";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";

export default async function AdminDepartmentsPage() {
  const departments = await getAdminDepartments();

  return (
    <>
      <Header title="부서 관리" />
      <div className="p-4 md:p-6 space-y-6 max-w-3xl">
        {/* Create form */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">새 부서 추가</CardTitle>
          </CardHeader>
          <CardContent>
            <DepartmentForm />
          </CardContent>
        </Card>

        {/* Department list */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">부서 목록</CardTitle>
          </CardHeader>
          <CardContent>
            {departments.length === 0 ? (
              <EmptyState
                icon="default"
                title="등록된 부서가 없습니다"
                description="위 폼에서 부서를 추가해주세요."
              />
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>부서명</TableHead>
                    <TableHead>소속 인원</TableHead>
                    <TableHead className="w-28"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {departments.map((dept) => (
                    <TableRow key={dept.id}>
                      <TableCell className="font-medium">{dept.name}</TableCell>
                      <TableCell>{dept._count.users}명</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/admin/departments/${dept.id}/edit`}
                            className="text-xs text-primary hover:underline"
                          >
                            수정
                          </Link>
                          {dept._count.users === 0 && (
                            <DeleteButton
                              action={deleteDepartment.bind(null, dept.id)}
                              confirmMessage={`"${dept.name}" 부서를 삭제하시겠습니까?`}
                            />
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}

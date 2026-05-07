// app/(dashboard)/admin/departments/page.tsx
// Admin: department management — create form + list in bento cards

import { Header } from "@/components/layout/Header";
import { EmptyState } from "@/components/ui/EmptyState";
import { DepartmentForm } from "@/components/forms/DepartmentForm";
import { DeleteButton } from "@/components/forms/DeleteButton";
import { getAdminDepartments } from "@/lib/queries/department-admin";
import { deleteDepartment } from "@/lib/actions/department";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import Link from "next/link";

export default async function AdminDepartmentsPage() {
  const departments = await getAdminDepartments();

  return (
    <>
      <Header title="부서 관리" subtitle={`${departments.length}개`} />
      <div className="p-4 md:p-8 max-w-3xl space-y-0">

        {/* Section 1: Create */}
        <section className="mb-8">
          <div className="section-header">
            <span className="section-number" aria-hidden="true">1</span>
            <h3 className="section-title">새 부서 추가</h3>
          </div>
          <div className="bento-card">
            <DepartmentForm />
          </div>
        </section>

        <div className="section-divider" />

        {/* Section 2: List */}
        <section className="mb-8">
          <div className="section-header">
            <span className="section-number" aria-hidden="true">2</span>
            <h3 className="section-title">부서 목록</h3>
          </div>

          {departments.length === 0 ? (
            <EmptyState
              icon="default"
              title="등록된 부서가 없습니다"
              description="위 폼에서 부서를 추가해주세요."
            />
          ) : (
            <div className="bento-card !p-0 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30">
                    <TableHead>부서명</TableHead>
                    <TableHead>
                      <div>등록 계정</div>
                      <div className="text-[11px] font-normal text-muted-foreground">리더/부서장</div>
                    </TableHead>
                    <TableHead className="w-28"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {departments.map((dept) => (
                    <TableRow key={dept.id}>
                      <TableCell className="font-medium">{dept.name}</TableCell>
                      <TableCell>{dept._count.users}개</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/admin/departments/${dept.id}/edit`}
                            className="text-xs text-primary hover:underline compact-link"
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
            </div>
          )}
        </section>
      </div>
    </>
  );
}

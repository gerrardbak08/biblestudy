// app/(dashboard)/admin/leaders/page.tsx
// Admin: leader list — bento card table, section header, CTA

import { Header } from "@/components/layout/Header";
import { getAdminLeaders } from "@/lib/queries/admin";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/EmptyState";
import Link from "next/link";
import { Plus } from "lucide-react";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";

export default async function AdminLeadersPage() {
  const leaders = await getAdminLeaders();

  return (
    <>
      <Header title="리더 관리" subtitle={`${leaders.length}명`} />
      <div className="p-4 md:p-8 max-w-[1200px] space-y-6">
        <div className="flex items-center justify-between">
          <div className="section-header !mb-0">
            <span className="section-number" aria-hidden="true">1</span>
            <h3 className="section-title">리더 목록</h3>
          </div>
          <Link href="/admin/leaders/new">
            <Button className="gap-1.5">
              <Plus className="h-4 w-4" />
              리더 추가
            </Button>
          </Link>
        </div>

        {leaders.length === 0 ? (
          <EmptyState
            icon="leaders"
            title="등록된 리더가 없습니다"
            description="성경공부 진행자를 등록하여 교육생 관리를 시작하세요."
            actionLabel="리더 추가"
            actionHref="/admin/leaders/new"
          />
        ) : (
          <div className="bento-card !p-0 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30">
                  <TableHead>이름</TableHead>
                  <TableHead>아이디</TableHead>
                  <TableHead>부서</TableHead>
                  <TableHead>교육생</TableHead>
                  <TableHead>보고서</TableHead>
                  <TableHead className="w-16"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leaders.map((leader) => (
                  <TableRow key={leader.id}>
                    <TableCell className="font-medium">{leader.name}</TableCell>
                    <TableCell className="text-muted-foreground">{leader.loginId}</TableCell>
                    <TableCell>{leader.department?.name ?? "-"}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{leader._count.learners}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{leader._count.reports}</Badge>
                    </TableCell>
                    <TableCell>
                      <Link
                        href={`/admin/leaders/${leader.id}/edit`}
                        className="text-xs text-primary hover:underline compact-link"
                      >
                        수정
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </>
  );
}

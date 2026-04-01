// app/(dashboard)/admin/leaders/page.tsx
// Admin: list of all leaders with learner/report counts + link to create new leader

import { Header } from "@/components/layout/Header";
import { getAdminLeaders } from "@/lib/queries/admin";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/EmptyState";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default async function AdminLeadersPage() {
  const leaders = await getAdminLeaders();

  return (
    <>
      <Header title="리더 관리" />
      <div className="p-6 space-y-4">
        <div className="flex justify-end">
          <Link href="/admin/leaders/new">
            <Button>리더 추가</Button>
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
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>이름</TableHead>
                <TableHead>아이디</TableHead>
                <TableHead>부서</TableHead>
                <TableHead>교육생 수</TableHead>
                <TableHead>보고서 수</TableHead>
                <TableHead className="w-16"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leaders.map((leader) => (
                <TableRow key={leader.id}>
                  <TableCell className="font-medium">{leader.name}</TableCell>
                  <TableCell>{leader.loginId}</TableCell>
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
                      className="text-xs text-primary hover:underline"
                    >
                      수정
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </>
  );
}

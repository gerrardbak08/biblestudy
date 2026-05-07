// app/(dashboard)/admin/leaders/page.tsx
// Admin: registered leader monitoring

import { Header } from "@/components/layout/Header";
import { getAdminLeaders } from "@/lib/queries/admin";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/EmptyState";
import Link from "next/link";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";

export default async function AdminLeadersPage() {
  const leaders = await getAdminLeaders();

  return (
    <>
      <Header title="리더 현황" subtitle={`가입 리더 ${leaders.length}명`} />
      <div className="p-4 md:p-8 max-w-[1200px] space-y-6">
        <div className="section-header !mb-0">
          <span className="section-number" aria-hidden="true">1</span>
          <div>
            <h3 className="section-title">가입 리더 목록</h3>
            <p className="section-desc">리더는 회원가입으로 등록되며, 관리자는 현황을 모니터링합니다.</p>
          </div>
        </div>

        {leaders.length === 0 ? (
          <EmptyState
            icon="leaders"
            title="가입한 리더가 없습니다"
            description="리더가 회원가입을 완료하면 이곳에 표시됩니다."
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

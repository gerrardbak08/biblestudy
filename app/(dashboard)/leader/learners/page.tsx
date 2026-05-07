// app/(dashboard)/leader/learners/page.tsx
// Leader: learner list — bento table, section header, CTA

import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getLeaderLearners } from "@/lib/queries/leader";
import { Header } from "@/components/layout/Header";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Plus } from "lucide-react";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";

export default async function LeaderLearnersPage() {
  const session = await auth();
  if (!session) redirect("/login");
  const learners = await getLeaderLearners(session.user.id);

  return (
    <>
      <Header title="내 교육생" subtitle={`${learners.length}명`} />
      <div className="p-4 md:p-8 max-w-[1000px] space-y-6">
        <div className="flex items-center justify-between">
          <div className="section-header !mb-0">
            <span className="section-number" aria-hidden="true">1</span>
            <h3 className="section-title">교육생 목록</h3>
          </div>
          <Link href="/leader/learners/new">
            <Button className="gap-1.5">
              <Plus className="h-4 w-4" />
              교육생 등록
            </Button>
          </Link>
        </div>

        {learners.length === 0 ? (
          <EmptyState
            icon="learners"
            title="등록된 교육생이 없습니다"
            description="교육생을 등록하고 성경공부 보고서를 관리해보세요."
            actionLabel="교육생 등록"
            actionHref="/leader/learners/new"
          />
        ) : (
          <div className="bento-card !p-0 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30">
                  <TableHead>이름</TableHead>
                  <TableHead>기관</TableHead>
                  <TableHead>연락처</TableHead>
                  <TableHead>보고서</TableHead>
                  <TableHead className="w-20"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {learners.map((learner) => (
                  <TableRow key={learner.id}>
                    <TableCell className="font-medium">{learner.name}</TableCell>
                    <TableCell>{learner.institution ?? "-"}</TableCell>
                    <TableCell className="text-muted-foreground">{learner.phone ?? "-"}</TableCell>
                    <TableCell>{learner._count.reports}</TableCell>
                    <TableCell>
                      <Link
                        href={`/leader/learners/${learner.id}`}
                        className="text-xs text-primary hover:underline compact-link"
                      >
                        진도 상세
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

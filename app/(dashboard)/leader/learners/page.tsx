// app/(dashboard)/leader/learners/page.tsx
// Leader: list of their own learners with report counts

import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getLeaderLearners } from "@/lib/queries/leader";
import { Header } from "@/components/layout/Header";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/EmptyState";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default async function LeaderLearnersPage() {
  const session = await auth();
  if (!session) redirect("/login");
  const learners = await getLeaderLearners(session.user.id);

  return (
    <>
      <Header title="내 교육생" />
      <div className="p-6 space-y-4">
        <div className="flex justify-end">
          <Link href="/leader/learners/new">
            <Button>교육생 등록</Button>
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
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>이름</TableHead>
                <TableHead>연락처</TableHead>
                <TableHead>보고서 수</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {learners.map((learner) => (
                <TableRow key={learner.id}>
                  <TableCell className="font-medium">{learner.name}</TableCell>
                  <TableCell>{learner.phone ?? "-"}</TableCell>
                  <TableCell>{learner._count.reports}</TableCell>
                  <TableCell>
                    <Link
                      href={`/leader/learners/${learner.id}`}
                      className="text-sm text-primary hover:underline"
                    >
                      진도 상세
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

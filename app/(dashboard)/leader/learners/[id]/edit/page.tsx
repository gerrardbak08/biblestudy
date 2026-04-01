// app/(dashboard)/leader/learners/[id]/edit/page.tsx
// Edit learner page — leader can update their learner's details

import { auth } from "@/lib/auth";
import { notFound, redirect } from "next/navigation";
import { getLearnerById } from "@/lib/queries/leader";
import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EditLearnerForm } from "@/components/forms/EditLearnerForm";
import Link from "next/link";

export default async function EditLearnerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();
  if (!session) redirect("/login");

  const learner = await getLearnerById(id);

  if (!learner || learner.leaderId !== session.user.id) notFound();

  return (
    <>
      <Header title="교육생 수정" />
      <div className="p-6 max-w-lg">
        <Link
          href={`/leader/learners/${id}`}
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          ← 돌아가기
        </Link>
        <Card className="mt-4">
          <CardHeader>
            <CardTitle>교육생 정보 수정</CardTitle>
          </CardHeader>
          <CardContent>
            <EditLearnerForm learner={learner} />
          </CardContent>
        </Card>
      </div>
    </>
  );
}

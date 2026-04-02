// app/(auth)/signup/page.tsx
// Clean SaaS signup

import { prisma } from "@/lib/prisma";
import { SignupForm } from "./SignupForm";

export default async function SignupPage() {
  const departments = await prisma.department.findMany({
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });

  return (
    <div className="w-full max-w-sm">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-semibold tracking-tight">회원가입</h1>
        <p className="text-sm text-muted-foreground mt-1">새 계정을 만드세요</p>
      </div>

      <SignupForm departments={departments} />
    </div>
  );
}

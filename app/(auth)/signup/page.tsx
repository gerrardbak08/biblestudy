// app/(auth)/signup/page.tsx
// Premium signup — matching login style

import { prisma } from "@/lib/prisma";
import { SignupForm } from "./SignupForm";

export default async function SignupPage() {
  const departments = await prisma.department.findMany({
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });

  return (
    <div className="w-full max-w-[380px]">
      {/* Brand */}
      <div className="text-center mb-10">
        <div className="h-12 w-12 rounded-2xl bg-primary flex items-center justify-center mx-auto mb-4">
          <span className="text-white text-lg font-bold">SG</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight">회원가입</h1>
        <p className="text-sm text-muted-foreground mt-1.5">새 계정을 만드세요</p>
      </div>

      <div className="bento-card !p-6">
        <SignupForm departments={departments} />
      </div>
    </div>
  );
}

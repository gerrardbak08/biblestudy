// app/(auth)/signup/page.tsx
// Sign up page — fetches departments from DB, simple registration

import { prisma } from "@/lib/prisma";
import { SignupForm } from "./SignupForm";

export default async function SignupPage() {
  const departments = await prisma.department.findMany({
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });

  return (
    <div className="w-full max-w-sm space-y-6">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10">
          <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7 text-primary" stroke="currentColor" strokeWidth="1.5">
            <path d="M12 2v8M8 6h8M7 22V10a5 5 0 0 1 10 0v12" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h1 className="font-serif text-xl font-bold text-foreground">회원가입</h1>
        <p className="text-sm text-muted-foreground">성경공부 관리 플랫폼에 가입하세요</p>
      </div>

      <SignupForm departments={departments} />
    </div>
  );
}

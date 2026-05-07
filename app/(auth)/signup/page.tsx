// app/(auth)/signup/page.tsx
// Premium signup — matching login style

import { SignupForm } from "./SignupForm";

export default async function SignupPage() {
  return (
    <div className="w-full max-w-[380px]">
      {/* Brand */}
      <div className="text-center mb-10">
        <p className="mx-auto mb-5 max-w-[320px] text-base font-semibold leading-snug text-primary break-keep">
          사랑과평안의교회 성경공부 관리현황
        </p>
        <h1 className="text-2xl font-bold">회원가입</h1>
        <p className="text-sm text-muted-foreground mt-1.5">새 계정을 만드세요</p>
      </div>

      <div className="bento-card !p-6">
        <SignupForm />
      </div>
    </div>
  );
}

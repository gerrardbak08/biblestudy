// app/(auth)/signup/SignupForm.tsx
// Clean SaaS signup form

"use client";

import { useActionState, useEffect } from "react";
import { signup } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FieldError } from "@/components/forms/FieldError";
import { toast } from "sonner";
import Link from "next/link";
import { SIGNUP_DEPARTMENT_OPTIONS } from "@/lib/constants";
import type { FormState } from "@/types/form";

const initialState: FormState = { errors: {} };

export function SignupForm() {
  const [state, formAction, isPending] = useActionState(signup, initialState);

  useEffect(() => {
    if (state.message) toast.error(state.message);
  }, [state]);

  return (
    <>
      <form action={formAction} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="loginId" className="text-sm">아이디</Label>
          <Input id="loginId" name="loginId" placeholder="영문, 숫자 (예: hong123)" autoComplete="username" className="h-10" />
          <FieldError errors={state.errors.loginId} />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="password" className="text-sm">비밀번호</Label>
          <Input id="password" name="password" type="password" placeholder="8자리 이상" autoComplete="new-password" className="h-10" />
          <FieldError errors={state.errors.password} />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="name" className="text-sm">이름</Label>
          <Input id="name" name="name" placeholder="홍길동" className="h-10" />
          <FieldError errors={state.errors.name} />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="departmentName" className="text-sm">소속</Label>
          <select
            id="departmentName"
            name="departmentName"
            defaultValue=""
            className="h-10 w-full rounded-md border border-input bg-muted/40 px-3 py-2 text-sm text-foreground ring-offset-background focus:bg-card focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          >
            <option value="" disabled>소속 선택</option>
            {SIGNUP_DEPARTMENT_OPTIONS.map((department) => (
              <option key={department} value={department}>
                {department}
              </option>
            ))}
          </select>
          <FieldError errors={state.errors.departmentName} />
        </div>

        {state.message && (
          <p className="text-sm text-destructive" role="alert">{state.message}</p>
        )}

        <Button type="submit" className="w-full h-10" disabled={isPending}>
          {isPending ? "가입 중..." : "가입하기"}
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground mt-6">
        이미 계정이 있으신가요?{" "}
        <Link href="/login" className="text-primary hover:underline font-medium">
          로그인
        </Link>
      </p>
    </>
  );
}

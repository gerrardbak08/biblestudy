// app/(auth)/login/page.tsx
// Clean SaaS login — Notion/Linear style

"use client";

import { useActionState } from "react";
import { login } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FieldError } from "@/components/forms/FieldError";
import Link from "next/link";
import type { FormState } from "@/types/form";

const initialState: FormState = { errors: {} };

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(login, initialState);

  return (
    <div className="w-full max-w-sm">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-semibold tracking-tight">성경공부 관리</h1>
        <p className="text-sm text-muted-foreground mt-1">계정에 로그인하세요</p>
      </div>

      <form action={formAction} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="loginId" className="text-sm">아이디</Label>
          <Input
            id="loginId"
            name="loginId"
            type="text"
            placeholder="아이디를 입력하세요"
            autoComplete="username"
            className="h-10"
          />
          <FieldError errors={state.errors.loginId} />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="password" className="text-sm">비밀번호</Label>
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="비밀번호를 입력하세요"
            autoComplete="current-password"
            className="h-10"
          />
          <FieldError errors={state.errors.password} />
        </div>

        {state.message && (
          <p className="text-sm text-destructive" role="alert">{state.message}</p>
        )}

        <Button type="submit" className="w-full h-10" disabled={isPending}>
          {isPending ? "로그인 중..." : "로그인"}
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground mt-6">
        계정이 없으신가요?{" "}
        <Link href="/signup" className="text-primary hover:underline font-medium">
          회원가입
        </Link>
      </p>
    </div>
  );
}

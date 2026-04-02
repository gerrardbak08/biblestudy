// app/(auth)/login/page.tsx
// Login — clear value proposition, accessible form, premium styling

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
    <div className="w-full max-w-[400px]">
      {/* Brand + value proposition */}
      <div className="text-center mb-10">
        <div className="h-12 w-12 rounded-2xl bg-primary flex items-center justify-center mx-auto mb-5" aria-hidden="true">
          <span className="text-white text-lg font-bold">SG</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight">
          성경공부 교육 현황을
          <br />
          <span className="text-primary">한눈에</span> 관리하세요
        </h1>
        <p className="text-sm text-muted-foreground mt-2">
          인도자별 진도, 보고서 제출, 교육생 현황을 실시간으로 확인합니다.
        </p>
      </div>

      {/* Form card */}
      <div className="bento-card !p-6">
        <form action={formAction} className="space-y-5" noValidate>
          <div className="space-y-2">
            <Label htmlFor="loginId" className="text-sm font-medium">아이디</Label>
            <Input
              id="loginId"
              name="loginId"
              type="text"
              placeholder="아이디를 입력하세요"
              autoComplete="username"
              required
              aria-required="true"
              className="h-11 bg-muted/40 border-border/50 focus:bg-card"
            />
            <FieldError errors={state.errors.loginId} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium">비밀번호</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="비밀번호를 입력하세요"
              autoComplete="current-password"
              required
              aria-required="true"
              className="h-11 bg-muted/40 border-border/50 focus:bg-card"
            />
            <FieldError errors={state.errors.password} />
          </div>

          {state.message && (
            <div className="rounded-lg bg-destructive/10 border border-destructive/20 px-3 py-2" role="alert">
              <p className="text-sm text-destructive font-medium">{state.message}</p>
            </div>
          )}

          <Button type="submit" className="w-full h-11 text-sm font-semibold" disabled={isPending}>
            {isPending ? "로그인 중..." : "로그인"}
          </Button>
        </form>
      </div>

      <p className="text-center text-sm text-muted-foreground mt-6">
        계정이 없으신가요?{" "}
        <Link href="/signup" className="text-primary hover:underline font-semibold compact-link">
          회원가입
        </Link>
      </p>
    </div>
  );
}

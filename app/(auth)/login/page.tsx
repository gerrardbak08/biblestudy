// app/(auth)/login/page.tsx
// Login page — Server Action handles signIn + redirect

"use client";

import { useActionState } from "react";
import { login } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FieldError } from "@/components/forms/FieldError";
import Link from "next/link";
import type { FormState } from "@/types/form";

const initialState: FormState = { errors: {} };

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(login, initialState);

  return (
    <div className="w-full max-w-sm space-y-6">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10">
          <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7 text-primary" stroke="currentColor" strokeWidth="1.5">
            <path d="M12 2v8M8 6h8M7 22V10a5 5 0 0 1 10 0v12" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h1 className="font-serif text-xl font-bold text-foreground">성경공부 관리</h1>
        <p className="text-sm text-muted-foreground">교회 성경공부 진행 현황 관리 플랫폼</p>
      </div>

      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-center text-base">로그인</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="loginId">아이디</Label>
              <Input
                id="loginId"
                name="loginId"
                type="text"
                placeholder="아이디 입력"
                autoComplete="username"
              />
              <FieldError errors={state.errors.loginId} />
            </div>

            <div className="space-y-1">
              <Label htmlFor="password">비밀번호</Label>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
              />
              <FieldError errors={state.errors.password} />
            </div>

            {state.message && (
              <p className="text-sm text-destructive" role="alert">{state.message}</p>
            )}

            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? "로그인 중..." : "로그인"}
            </Button>
          </form>

          <div className="mt-4 text-center">
            <Link href="/signup" className="text-sm text-muted-foreground hover:text-foreground">
              계정이 없으신가요? <span className="text-primary font-medium">회원가입</span>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

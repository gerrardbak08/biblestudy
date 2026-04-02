// app/(auth)/login/page.tsx
// Login page — direct fetch to NextAuth callback (most reliable on Vercel)

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FieldError } from "@/components/forms/FieldError";
import Link from "next/link";

export default function LoginPage() {
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setFieldErrors({});

    const form = new FormData(e.currentTarget);
    const loginId = (form.get("loginId") as string)?.trim();
    const password = form.get("password") as string;

    if (!loginId) {
      setFieldErrors({ loginId: ["아이디를 입력해주세요"] });
      setLoading(false);
      return;
    }
    if (!password) {
      setFieldErrors({ password: ["비밀번호를 입력해주세요"] });
      setLoading(false);
      return;
    }

    // 1. Get CSRF token
    const csrfRes = await fetch("/api/auth/csrf");
    const { csrfToken } = await csrfRes.json();

    // 2. POST directly to NextAuth credentials callback
    const res = await fetch("/api/auth/callback/credentials", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        csrfToken,
        loginId,
        password,
        redirect: "false",
      }),
    });

    // 3. Check result — NextAuth returns 200 with URL on success, or error
    const url = new URL(res.url);
    if (url.searchParams.has("error")) {
      setError("아이디 또는 비밀번호가 올바르지 않습니다.");
      setLoading(false);
      return;
    }

    // 4. Success — navigate to home
    window.location.href = "/";
  }

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
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="loginId">아이디</Label>
              <Input
                id="loginId"
                name="loginId"
                type="text"
                placeholder="아이디 입력"
                autoComplete="username"
              />
              <FieldError errors={fieldErrors.loginId} />
            </div>

            <div className="space-y-1">
              <Label htmlFor="password">비밀번호</Label>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
              />
              <FieldError errors={fieldErrors.password} />
            </div>

            {error && (
              <p className="text-sm text-destructive" role="alert">{error}</p>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "로그인 중..." : "로그인"}
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

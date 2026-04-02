// app/(auth)/login/page.tsx
// Login page — native form submit to NextAuth (no fetch, most reliable)

"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

function LoginForm() {
  const [csrfToken, setCsrfToken] = useState("");
  const [validationError, setValidationError] = useState("");
  const [authError, setAuthError] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    // Fetch CSRF token
    fetch("/api/auth/csrf")
      .then((res) => res.json())
      .then((data) => setCsrfToken(data.csrfToken))
      .catch(() => {});

    // Check URL for auth error (NextAuth redirects with ?error=...)
    if (window.location.search.includes("error")) {
      setAuthError(true);
    }
  }, []);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    const form = formRef.current;
    if (!form) return;

    const loginId = (form.elements.namedItem("loginId") as HTMLInputElement)?.value?.trim();
    const password = (form.elements.namedItem("password") as HTMLInputElement)?.value;

    if (!loginId || !password) {
      e.preventDefault();
      setValidationError(!loginId ? "아이디를 입력해주세요" : "비밀번호를 입력해주세요");
      return;
    }

    setValidationError("");
    // Let form submit natively — browser handles 302 + cookie setting
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-center text-base">로그인</CardTitle>
      </CardHeader>
      <CardContent>
        <form
          ref={formRef}
          method="POST"
          action="/api/auth/callback/credentials"
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          <input type="hidden" name="csrfToken" value={csrfToken} />
          <input type="hidden" name="callbackUrl" value="/" />

          <div className="space-y-1">
            <Label htmlFor="loginId">아이디</Label>
            <Input
              id="loginId"
              name="loginId"
              type="text"
              placeholder="아이디 입력"
              autoComplete="username"
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="password">비밀번호</Label>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
            />
          </div>

          {(authError || validationError) && (
            <p className="text-sm text-destructive" role="alert">
              {validationError || "아이디 또는 비밀번호가 올바르지 않습니다."}
            </p>
          )}

          <Button type="submit" className="w-full" disabled={!csrfToken}>
            {!csrfToken ? "준비 중..." : "로그인"}
          </Button>
        </form>

        <div className="mt-4 text-center">
          <Link href="/signup" className="text-sm text-muted-foreground hover:text-foreground">
            계정이 없으신가요? <span className="text-primary font-medium">회원가입</span>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

export default function LoginPage() {
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

      <Suspense>
        <LoginForm />
      </Suspense>
    </div>
  );
}

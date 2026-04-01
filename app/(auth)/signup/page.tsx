// app/(auth)/signup/page.tsx
// Sign up page — simple registration with ID, password, name, department

"use client";

import { useActionState, useEffect, useState } from "react";
import { signup } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FieldError } from "@/components/forms/FieldError";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import Link from "next/link";
import type { FormState } from "@/types/form";

const DEPARTMENTS = [
  { id: "1장년", name: "1장년" },
  { id: "2장년", name: "2장년" },
  { id: "청년부", name: "청년부" },
  { id: "중고등부", name: "중고등부" },
];

const initialState: FormState = { errors: {} };

export default function SignupPage() {
  const [state, formAction, isPending] = useActionState(signup, initialState);
  const [departmentId, setDepartmentId] = useState("");

  useEffect(() => {
    if (state.message) toast.error(state.message);
  }, [state]);

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

      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-center text-base">간편 가입</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="space-y-4">
            <input type="hidden" name="departmentId" value={departmentId} />

            <div className="space-y-1">
              <Label htmlFor="loginId">아이디 *</Label>
              <Input
                id="loginId"
                name="loginId"
                placeholder="영문, 숫자 (예: hong123)"
                autoComplete="username"
              />
              <FieldError errors={state.errors.loginId} />
            </div>

            <div className="space-y-1">
              <Label htmlFor="password">비밀번호 *</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="4자리 이상"
                autoComplete="new-password"
              />
              <FieldError errors={state.errors.password} />
            </div>

            <div className="space-y-1">
              <Label htmlFor="name">이름 *</Label>
              <Input
                id="name"
                name="name"
                placeholder="홍길동"
              />
              <FieldError errors={state.errors.name} />
            </div>

            <div className="space-y-1">
              <Label>소속 *</Label>
              <Select onValueChange={setDepartmentId}>
                <SelectTrigger>
                  <SelectValue placeholder="소속 선택" />
                </SelectTrigger>
                <SelectContent>
                  {DEPARTMENTS.map((d) => (
                    <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FieldError errors={state.errors.departmentId} />
            </div>

            {state.message && (
              <p className="text-sm text-destructive" role="alert">{state.message}</p>
            )}

            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? "가입 중..." : "가입하기"}
            </Button>
          </form>

          <div className="mt-4 text-center">
            <Link href="/login" className="text-sm text-muted-foreground hover:text-foreground">
              이미 계정이 있으신가요? <span className="text-primary font-medium">로그인</span>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

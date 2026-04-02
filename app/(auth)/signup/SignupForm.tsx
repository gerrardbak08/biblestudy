// app/(auth)/signup/SignupForm.tsx
// Clean SaaS signup form

"use client";

import { useActionState, useEffect, useState } from "react";
import { signup } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
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

const initialState: FormState = { errors: {} };

interface SignupFormProps {
  departments: { id: string; name: string }[];
}

export function SignupForm({ departments }: SignupFormProps) {
  const [state, formAction, isPending] = useActionState(signup, initialState);
  const [departmentId, setDepartmentId] = useState("");

  useEffect(() => {
    if (state.message) toast.error(state.message);
  }, [state]);

  return (
    <>
      <form action={formAction} className="space-y-4">
        <input type="hidden" name="departmentId" value={departmentId} />

        <div className="space-y-1.5">
          <Label htmlFor="loginId" className="text-sm">아이디</Label>
          <Input id="loginId" name="loginId" placeholder="영문, 숫자 (예: hong123)" autoComplete="username" className="h-10" />
          <FieldError errors={state.errors.loginId} />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="password" className="text-sm">비밀번호</Label>
          <Input id="password" name="password" type="password" placeholder="4자리 이상" autoComplete="new-password" className="h-10" />
          <FieldError errors={state.errors.password} />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="name" className="text-sm">이름</Label>
          <Input id="name" name="name" placeholder="홍길동" className="h-10" />
          <FieldError errors={state.errors.name} />
        </div>

        <div className="space-y-1.5">
          <Label className="text-sm">소속</Label>
          <Select onValueChange={setDepartmentId}>
            <SelectTrigger className="h-10">
              <SelectValue placeholder="소속 선택" />
            </SelectTrigger>
            <SelectContent>
              {departments.map((d) => (
                <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FieldError errors={state.errors.departmentId} />
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

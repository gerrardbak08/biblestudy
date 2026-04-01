// components/forms/CreateLeaderForm.tsx
// Client-side form for admin to create a new leader account with department selection.

"use client";

import { useActionState, useState, useEffect } from "react";
import { createLeader } from "@/lib/actions/leader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FieldError } from "@/components/forms/FieldError";
import type { FormState } from "@/types/form";

interface CreateLeaderFormProps {
  departments: { id: string; name: string }[];
}

const initialState: FormState = { errors: {} };

export function CreateLeaderForm({ departments }: CreateLeaderFormProps) {
  const [state, formAction, isPending] = useActionState(
    createLeader,
    initialState
  );

  const [departmentId, setDepartmentId] = useState("");

  useEffect(() => {
    if (state.message) toast.error(state.message);
  }, [state]);

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="departmentId" value={departmentId} />

      <div className="space-y-1">
        <Label htmlFor="name">이름 *</Label>
        <Input id="name" name="name" placeholder="홍길동" />
        <FieldError errors={state.errors.name} />
      </div>

      <div className="space-y-1">
        <Label htmlFor="email">이메일 *</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="leader@church.org"
          autoComplete="off"
        />
        <FieldError errors={state.errors.email} />
      </div>

      <div className="space-y-1">
        <Label htmlFor="password">비밀번호 *</Label>
        <Input
          id="password"
          name="password"
          type="password"
          placeholder="최소 8자"
          autoComplete="new-password"
        />
        <FieldError errors={state.errors.password} />
      </div>

      <div className="space-y-1">
        <Label htmlFor="phone">연락처</Label>
        <Input
          id="phone"
          name="phone"
          type="tel"
          placeholder="010-0000-0000"
        />
        <FieldError errors={state.errors.phone} />
      </div>

      <div className="space-y-1">
        <Label>소속 기관 *</Label>
        <Select onValueChange={setDepartmentId}>
          <SelectTrigger>
            <SelectValue placeholder="기관 선택" />
          </SelectTrigger>
          <SelectContent>
            {departments.map((dept) => (
              <SelectItem key={dept.id} value={dept.id}>
                {dept.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <FieldError errors={state.errors.departmentId} />
      </div>

      {state.message && (
        <p className="text-sm text-destructive">{state.message}</p>
      )}

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? "등록 중..." : "리더 계정 생성"}
      </Button>
    </form>
  );
}

// components/forms/EditLeaderForm.tsx
// Admin form for editing leader details

"use client";

import { useActionState, useState, useEffect } from "react";
import { updateLeader, resetLeaderPassword } from "@/lib/actions/leader";
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
import type { FormState } from "@/types/form";

const initialState: FormState = { errors: {} };

interface EditLeaderFormProps {
  leader: {
    id: string;
    name: string;
    loginId: string;
    phone: string | null;
    role: string;
    departmentId: string | null;
  };
  departments: { id: string; name: string }[];
}

export function EditLeaderForm({ leader, departments }: EditLeaderFormProps) {
  const [state, formAction, isPending] = useActionState(updateLeader, initialState);
  const [resetState, resetAction, isResetting] = useActionState(resetLeaderPassword, initialState);

  const [departmentId, setDepartmentId] = useState(leader.departmentId ?? "");
  const [role, setRole] = useState(leader.role);

  useEffect(() => {
    if (state.message) toast.error(state.message);
  }, [state]);

  useEffect(() => {
    if (resetState.message) {
      if (resetState.message.startsWith("임시")) {
        toast.success(resetState.message);
      } else {
        toast.error(resetState.message);
      }
    }
  }, [resetState]);

  return (
    <div className="space-y-6">
      <form action={formAction} className="space-y-4">
        <input type="hidden" name="id" value={leader.id} />
        <input type="hidden" name="departmentId" value={departmentId} />
        <input type="hidden" name="role" value={role} />

        <div className="space-y-1">
          <Label htmlFor="name">이름 *</Label>
          <Input id="name" name="name" defaultValue={leader.name} />
          <FieldError errors={state.errors.name} />
        </div>

        <div className="space-y-1">
          <Label htmlFor="loginId">아이디 *</Label>
          <Input id="loginId" name="loginId" type="text" defaultValue={leader.loginId} />
          <FieldError errors={state.errors.loginId} />
        </div>

        <div className="space-y-1">
          <Label htmlFor="phone">연락처</Label>
          <Input id="phone" name="phone" defaultValue={leader.phone ?? ""} placeholder="010-0000-0000" />
          <FieldError errors={state.errors.phone} />
        </div>

        <div className="space-y-1">
          <Label>부서</Label>
          <Select value={departmentId} onValueChange={setDepartmentId}>
            <SelectTrigger>
              <SelectValue placeholder="부서 선택" />
            </SelectTrigger>
            <SelectContent>
              {departments.map((d) => (
                <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1">
          <Label>역할</Label>
          <Select value={role} onValueChange={setRole}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="LEADER">진행자 (LEADER)</SelectItem>
              <SelectItem value="DEPT_HEAD">기관장 (DEPT_HEAD)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? "수정 중..." : "정보 수정"}
        </Button>
      </form>

      {/* Password reset */}
      <div className="border-t pt-4">
        <form action={resetAction}>
          <input type="hidden" name="id" value={leader.id} />
          <Button type="submit" variant="outline" className="w-full" disabled={isResetting}>
            {isResetting ? "초기화 중..." : "비밀번호 초기화"}
          </Button>
          <p className="text-xs text-muted-foreground mt-1 text-center">
            임시 비밀번호가 생성되어 화면에 표시됩니다.
          </p>
        </form>
      </div>
    </div>
  );
}

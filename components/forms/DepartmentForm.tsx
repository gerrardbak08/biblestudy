// components/forms/DepartmentForm.tsx
// Create/edit form for departments

"use client";

import { useActionState, useEffect } from "react";
import { createDepartment, updateDepartment } from "@/lib/actions/department";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FieldError } from "@/components/forms/FieldError";
import { toast } from "sonner";
import type { FormState } from "@/types/form";

const initialState: FormState = { errors: {} };

interface DepartmentFormProps {
  defaultValues?: { id: string; name: string };
  mode?: "create" | "edit";
}

export function DepartmentForm({ defaultValues, mode = "create" }: DepartmentFormProps) {
  const action = mode === "edit" ? updateDepartment : createDepartment;
  const [state, formAction, isPending] = useActionState(action, initialState);

  useEffect(() => {
    if (state.message) toast.error(state.message);
  }, [state]);

  return (
    <form action={formAction} className="space-y-4">
      {mode === "edit" && defaultValues?.id && (
        <input type="hidden" name="id" value={defaultValues.id} />
      )}

      <div className="space-y-1">
        <Label htmlFor="name">부서명 *</Label>
        <Input
          id="name"
          name="name"
          placeholder="예: 청년부"
          defaultValue={defaultValues?.name}
        />
        <FieldError errors={state.errors.name} />
      </div>

      {state.message && (
        <p className="text-sm text-destructive" role="alert">{state.message}</p>
      )}

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending
          ? (mode === "edit" ? "수정 중..." : "생성 중...")
          : (mode === "edit" ? "수정" : "부서 생성")}
      </Button>
    </form>
  );
}

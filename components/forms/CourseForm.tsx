// components/forms/CourseForm.tsx
// Create/edit form for curriculum courses

"use client";

import { useActionState, useEffect } from "react";
import { createCourse, updateCourse } from "@/lib/actions/curriculum";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FieldError } from "@/components/forms/FieldError";
import { toast } from "sonner";
import type { FormState } from "@/types/form";

const initialState: FormState = { errors: {} };

interface CourseFormProps {
  defaultValues?: { id: string; name: string; level: string; order: number };
  mode?: "create" | "edit";
}

export function CourseForm({ defaultValues, mode = "create" }: CourseFormProps) {
  const action = mode === "edit" ? updateCourse : createCourse;
  const [state, formAction, isPending] = useActionState(action, initialState);

  useEffect(() => {
    if (state.message) toast.error(state.message);
  }, [state]);

  return (
    <form action={formAction} className="space-y-3">
      {mode === "edit" && defaultValues?.id && (
        <input type="hidden" name="id" value={defaultValues.id} />
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="space-y-1 sm:col-span-1">
          <Label htmlFor="name">과정명 *</Label>
          <Input id="name" name="name" placeholder="교인등록 과정" defaultValue={defaultValues?.name} />
          <FieldError errors={state.errors.name} />
        </div>
        <div className="space-y-1">
          <Label htmlFor="level">레벨 *</Label>
          <Input id="level" name="level" placeholder="기초" defaultValue={defaultValues?.level} />
          <FieldError errors={state.errors.level} />
        </div>
        <div className="space-y-1">
          <Label htmlFor="order">순서 *</Label>
          <Input id="order" name="order" type="number" min="0" defaultValue={defaultValues?.order ?? 0} />
          <FieldError errors={state.errors.order} />
        </div>
      </div>

      <Button type="submit" size="sm" disabled={isPending}>
        {isPending ? (mode === "edit" ? "수정 중..." : "추가 중...") : (mode === "edit" ? "수정" : "과정 추가")}
      </Button>
    </form>
  );
}

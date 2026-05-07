// components/forms/LearnerForm.tsx
// Client-side form for registering a learner.
// Uses useActionState to receive Zod field errors from the server action.

"use client";

import { useActionState, useEffect } from "react";
import { createLearner } from "@/lib/actions/learner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { FieldError } from "@/components/forms/FieldError";
import { LEARNER_INSTITUTION_OPTIONS } from "@/lib/constants";
import type { FormState } from "@/types/form";

const initialState: FormState = { errors: {} };
const selectClassName =
  "h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

export function LearnerForm() {
  const [state, formAction, isPending] = useActionState(
    createLearner,
    initialState
  );

  useEffect(() => {
    if (state.message) toast.error(state.message);
  }, [state]);

  return (
    <form action={formAction} className="space-y-4">
      <div className="space-y-1">
        <Label htmlFor="name">이름 *</Label>
        <Input id="name" name="name" placeholder="홍길동" />
        <FieldError errors={state.errors.name} />
      </div>

      <div className="space-y-1">
        <Label htmlFor="institution">기관 *</Label>
        <select
          id="institution"
          name="institution"
          defaultValue=""
          className={selectClassName}
        >
          <option value="" disabled>기관 선택</option>
          {LEARNER_INSTITUTION_OPTIONS.map((institution) => (
            <option key={institution} value={institution}>
              {institution}
            </option>
          ))}
        </select>
        <FieldError errors={state.errors.institution} />
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
        <Label htmlFor="notes">메모</Label>
        <Textarea
          id="notes"
          name="notes"
          rows={3}
          placeholder="특이사항, 기도 제목 등"
        />
        <FieldError errors={state.errors.notes} />
      </div>

      {/* Top-level message (e.g. server errors) */}
      {state.message && (
        <p className="text-sm text-destructive">{state.message}</p>
      )}

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? "등록 중..." : "등록"}
      </Button>
    </form>
  );
}

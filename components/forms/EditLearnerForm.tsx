// components/forms/EditLearnerForm.tsx
// Client-side form for editing a learner's details

"use client";

import { useActionState } from "react";
import { updateLearner } from "@/lib/actions/learner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FieldError } from "@/components/forms/FieldError";
import { LEARNER_INSTITUTION_OPTIONS } from "@/lib/constants";
import type { FormState } from "@/types/form";

const initialState: FormState = { errors: {} };
const selectClassName =
  "h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

interface EditLearnerFormProps {
  learner: {
    id: string;
    name: string;
    institution: string | null;
    phone: string | null;
    notes: string | null;
  };
}

export function EditLearnerForm({ learner }: EditLearnerFormProps) {
  const [state, formAction, isPending] = useActionState(
    updateLearner,
    initialState
  );

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="id" value={learner.id} />

      <div className="space-y-1">
        <Label htmlFor="name">이름 *</Label>
        <Input id="name" name="name" defaultValue={learner.name} />
        <FieldError errors={state.errors.name} />
      </div>

      <div className="space-y-1">
        <Label htmlFor="institution">기관 *</Label>
        <select
          id="institution"
          name="institution"
          defaultValue={learner.institution ?? ""}
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
          defaultValue={learner.phone ?? ""}
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
          defaultValue={learner.notes ?? ""}
          placeholder="특이사항, 기도 제목 등"
        />
        <FieldError errors={state.errors.notes} />
      </div>

      {state.message && (
        <p className="text-sm text-destructive">{state.message}</p>
      )}

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? "수정 중..." : "수정"}
      </Button>
    </form>
  );
}

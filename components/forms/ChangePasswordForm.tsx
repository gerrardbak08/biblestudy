// components/forms/ChangePasswordForm.tsx
// Client-side form for changing the user's password

"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { changePassword } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";
import { FieldError } from "@/components/forms/FieldError";
import type { FormState } from "@/types/form";

function PasswordInput({
  id,
  name,
  placeholder,
}: {
  id: string;
  name: string;
  placeholder?: string;
}) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <Input
        id={id}
        name={name}
        type={show ? "text" : "password"}
        placeholder={placeholder}
        className="pr-10"
      />
      <button
        type="button"
        onClick={() => setShow((prev) => !prev)}
        className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground transition-colors"
        aria-label={show ? "비밀번호 숨기기" : "비밀번호 표시"}
      >
        {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </button>
    </div>
  );
}

const initialState: FormState = { errors: {} };

export function ChangePasswordForm() {
  const [state, formAction, isPending] = useActionState(
    changePassword,
    initialState
  );
  const formRef = useRef<HTMLFormElement>(null);

  const isSuccess = state.message === "비밀번호가 변경되었습니다.";

  useEffect(() => {
    if (isSuccess) {
      toast.success("비밀번호가 변경되었습니다.");
      formRef.current?.reset();
    } else if (state.message && !isSuccess) {
      toast.error(state.message);
    }
  }, [state, isSuccess]);

  return (
    <form ref={formRef} action={formAction} className="space-y-4">
      <div className="space-y-1">
        <Label htmlFor="currentPassword">현재 비밀번호</Label>
        <PasswordInput id="currentPassword" name="currentPassword" />
        <FieldError errors={state.errors.currentPassword} />
      </div>

      <div className="space-y-1">
        <Label htmlFor="newPassword">새 비밀번호</Label>
        <PasswordInput id="newPassword" name="newPassword" placeholder="최소 8자" />
        <FieldError errors={state.errors.newPassword} />
      </div>

      <div className="space-y-1">
        <Label htmlFor="confirmPassword">새 비밀번호 확인</Label>
        <PasswordInput id="confirmPassword" name="confirmPassword" />
        <FieldError errors={state.errors.confirmPassword} />
      </div>

      {state.message && (
        <p
          className={`text-sm flex items-center gap-1 ${isSuccess ? "text-primary" : "text-destructive"}`}
          role={isSuccess ? "status" : "alert"}
        >
          {isSuccess ? "V" : "!"} {state.message}
        </p>
      )}

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? "변경 중..." : "비밀번호 변경"}
      </Button>
    </form>
  );
}

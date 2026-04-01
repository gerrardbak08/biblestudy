// components/forms/DeleteButton.tsx
// Reusable delete button with confirmation dialog

"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface DeleteButtonProps {
  action: () => Promise<void>;
  confirmMessage?: string;
  label?: string;
}

export function DeleteButton({
  action,
  confirmMessage = "정말 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.",
  label = "삭제",
}: DeleteButtonProps) {
  const [isPending, startTransition] = useTransition();
  const [showConfirm, setShowConfirm] = useState(false);

  if (showConfirm) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-xs text-destructive">{confirmMessage}</span>
        <Button
          variant="destructive"
          size="sm"
          disabled={isPending}
          onClick={() =>
            startTransition(async () => {
              try {
                await action();
              } catch {
                toast.error("삭제 중 오류가 발생했습니다.");
              }
            })
          }
        >
          {isPending ? "삭제 중..." : "확인"}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowConfirm(false)}
          disabled={isPending}
        >
          취소
        </Button>
      </div>
    );
  }

  return (
    <Button
      variant="destructive"
      size="sm"
      onClick={() => setShowConfirm(true)}
    >
      {label}
    </Button>
  );
}

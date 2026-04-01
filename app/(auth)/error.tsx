// app/(auth)/error.tsx
// Error boundary for auth pages

"use client";

import { Button } from "@/components/ui/button";

export default function AuthError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="max-w-sm w-full text-center space-y-4">
        <h2 className="text-lg font-semibold text-destructive">
          오류가 발생했습니다
        </h2>
        <p className="text-sm text-muted-foreground">
          {error.message || "로그인 중 문제가 발생했습니다."}
        </p>
        <div className="flex justify-center gap-2">
          <Button onClick={reset}>다시 시도</Button>
          <Button variant="outline" onClick={() => (window.location.href = "/login")}>
            로그인으로
          </Button>
        </div>
      </div>
    </div>
  );
}

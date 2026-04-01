// app/(dashboard)/error.tsx
// Error boundary for all dashboard pages

"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="p-6 flex items-center justify-center min-h-[50vh]">
      <Card className="max-w-md w-full">
        <CardHeader>
          <CardTitle className="text-destructive">오류가 발생했습니다</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            {error.message || "페이지를 불러오는 중 문제가 발생했습니다."}
          </p>
          {error.digest && (
            <p className="text-xs text-muted-foreground">
              오류 코드: {error.digest}
            </p>
          )}
          <div className="flex gap-2">
            <Button onClick={reset}>다시 시도</Button>
            <Button variant="outline" onClick={() => window.history.back()}>
              뒤로 가기
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// app/(dashboard)/leader/reports/loading.tsx
// Reports list loading skeleton

import { Skeleton, SkeletonTable } from "@/components/ui/skeleton";

export default function ReportsLoading() {
  return (
    <div className="p-4 md:p-6 space-y-4">
      {/* Header */}
      <Skeleton className="h-8 w-28" />

      {/* Top bar */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-9 w-24 rounded-md" />
      </div>

      {/* Table */}
      <SkeletonTable rows={8} />
    </div>
  );
}

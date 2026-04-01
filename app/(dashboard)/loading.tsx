// app/(dashboard)/loading.tsx
// Shared loading skeleton for all dashboard pages

import {
  Skeleton,
  SkeletonCard,
  SkeletonChart,
  SkeletonTable,
} from "@/components/ui/skeleton";

export default function DashboardLoading() {
  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header skeleton */}
      <Skeleton className="h-8 w-48" />

      {/* Stats cards skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <SkeletonCard key={i} />
        ))}
      </div>

      {/* Charts skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <SkeletonChart />
        <SkeletonChart />
      </div>

      {/* Table skeleton */}
      <SkeletonTable rows={5} />
    </div>
  );
}

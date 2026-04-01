// app/(dashboard)/dept/loading.tsx
// Department head dashboard loading skeleton

import {
  Skeleton,
  SkeletonCard,
  SkeletonTable,
} from "@/components/ui/skeleton";

export default function DeptLoading() {
  return (
    <div className="p-4 md:p-6 space-y-6">
      <Skeleton className="h-8 w-36" />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <SkeletonCard key={i} />
        ))}
      </div>

      <SkeletonTable rows={5} />
    </div>
  );
}

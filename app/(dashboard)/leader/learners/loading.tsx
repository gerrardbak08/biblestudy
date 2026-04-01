// app/(dashboard)/leader/learners/loading.tsx
// Learners list loading skeleton

import { Skeleton, SkeletonTable } from "@/components/ui/skeleton";

export default function LearnersLoading() {
  return (
    <div className="p-4 md:p-6 space-y-4">
      <Skeleton className="h-8 w-28" />
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-9 w-28 rounded-md" />
      </div>
      <SkeletonTable rows={6} />
    </div>
  );
}

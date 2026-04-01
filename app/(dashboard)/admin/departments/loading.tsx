// app/(dashboard)/admin/departments/loading.tsx
import { Skeleton, SkeletonTable } from "@/components/ui/skeleton";

export default function DepartmentsLoading() {
  return (
    <div className="p-4 md:p-6 space-y-6 max-w-3xl">
      <Skeleton className="h-8 w-28" />
      <div className="rounded-lg border bg-card p-6 space-y-3">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-9 w-full" />
        <Skeleton className="h-9 w-24" />
      </div>
      <SkeletonTable rows={4} />
    </div>
  );
}

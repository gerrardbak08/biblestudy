// app/(dashboard)/admin/curriculum/loading.tsx
import { Skeleton, SkeletonCard } from "@/components/ui/skeleton";

export default function CurriculumLoading() {
  return (
    <div className="p-4 md:p-6 space-y-6 max-w-3xl">
      <Skeleton className="h-8 w-32" />
      <div className="rounded-lg border bg-card p-6 space-y-3">
        <Skeleton className="h-5 w-32" />
        <div className="grid grid-cols-3 gap-3">
          <Skeleton className="h-9" />
          <Skeleton className="h-9" />
          <Skeleton className="h-9" />
        </div>
      </div>
      {[1, 2, 3].map((i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

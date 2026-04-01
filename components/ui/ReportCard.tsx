// components/ui/ReportCard.tsx
// Mobile-friendly card layout for report list items

import { Badge } from "@/components/ui/badge";
import Link from "next/link";

interface ReportCardProps {
  id: string;
  weekDate: Date;
  learnerName: string;
  leaderName?: string;
  content: string;
  attended: boolean;
  progressStatus?: string | null;
  detailHref: string;
}

export function ReportCard({
  weekDate,
  learnerName,
  leaderName,
  content,
  attended,
  progressStatus,
  detailHref,
}: ReportCardProps) {
  return (
    <Link href={detailHref} className="block">
      <div className="rounded-xl border bg-card p-4 space-y-2 transition-all duration-200 hover:bg-secondary/50 hover:shadow-md active:bg-secondary active:scale-[0.99]">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">{learnerName}</span>
          <span className="text-xs text-muted-foreground">
            {weekDate.toLocaleDateString("ko-KR", { month: "short", day: "numeric" })}
          </span>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2">{content}</p>
        <div className="flex items-center gap-2">
          <Badge variant={attended ? "default" : "destructive"} className="text-[11px]">
            {attended ? "출석" : "결석"}
          </Badge>
          {progressStatus && (
            <Badge variant="secondary" className="text-[11px]">
              {progressStatus}
            </Badge>
          )}
          {leaderName && (
            <span className="text-[10px] text-muted-foreground ml-auto">
              {leaderName}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

// components/ui/ProgressBar.tsx
// Modern progress bar with smooth animation and color coding

interface ProgressBarProps {
  percentage: number;
  size?: "sm" | "md";
  showLabel?: boolean;
}

export function ProgressBar({ percentage, size = "sm", showLabel = true }: ProgressBarProps) {
  const barColor =
    percentage >= 80 ? "bg-emerald-500" :
    percentage >= 50 ? "bg-primary" :
    percentage >= 20 ? "bg-amber-500" :
    "bg-muted-foreground/30";

  return (
    <div className="flex items-center gap-2.5">
      <div className={`flex-1 ${size === "md" ? "h-2.5" : "h-1.5"} bg-muted/60 rounded-full overflow-hidden`}>
        <div
          className={`h-full rounded-full transition-all duration-700 ease-out ${barColor}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showLabel && (
        <span className="text-xs font-medium text-muted-foreground tabular-nums w-10 text-right">
          {percentage}%
        </span>
      )}
    </div>
  );
}

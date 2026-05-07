// components/dashboard/StatCard.tsx
// Bento stat card — big number / small label / background watermark icon

import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: LucideIcon;
  iconColor?: string;
  trend?: string;
}

export function StatCard({ label, value, icon: Icon, iconColor, trend }: StatCardProps) {
  return (
    <div className="bento-card group relative overflow-hidden !p-4 sm:!p-5">
      {/* Background watermark icon */}
      {Icon && (
        <Icon
          className={`absolute -right-2 -top-2 h-14 w-14 opacity-[0.06] sm:h-16 sm:w-16 ${iconColor ?? "text-muted-foreground"}`}
          aria-hidden="true"
        />
      )}

      <div className="relative">
        <p className="stat-label mb-2">{label}</p>
        <div className="flex items-end gap-2">
          <p className="stat-number" aria-label={`${label} ${value}`}>{value}</p>
          {trend && (
            <span className="text-xs font-semibold text-emerald-600 mb-1">{trend}</span>
          )}
        </div>
      </div>
    </div>
  );
}

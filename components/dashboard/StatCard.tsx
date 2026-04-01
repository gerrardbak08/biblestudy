// components/dashboard/StatCard.tsx
// Reusable stats card for dashboard overview pages

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: LucideIcon;
  iconColor?: string;
}

export function StatCard({ label, value, icon: Icon, iconColor }: StatCardProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xs font-medium text-muted-foreground">
            {label}
          </CardTitle>
          {Icon && (
            <Icon className={`h-4 w-4 ${iconColor ?? "text-muted-foreground"}`} aria-hidden="true" />
          )}
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-2xl md:text-3xl font-bold">{value}</p>
      </CardContent>
    </Card>
  );
}

// components/charts/WeeklyReportChart.tsx
// Bar chart showing weekly report submission counts

"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { EmptyState } from "@/components/ui/EmptyState";

interface WeeklyData {
  week: string;
  count: number;
}

export function WeeklyReportChart({ data }: { data: WeeklyData[] }) {
  if (data.length === 0) {
    return (
      <EmptyState
        icon="reports"
        title="데이터가 없습니다"
        description="보고서가 제출되면 주간 차트가 표시됩니다."
      />
    );
  }

  return (
    <div role="img" aria-label="주간 보고서 제출 현황 차트">
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--chart-grid))" />
          <XAxis dataKey="week" fontSize={12} stroke="hsl(var(--chart-text))" />
          <YAxis allowDecimals={false} fontSize={12} stroke="hsl(var(--chart-text))" />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--card))",
              borderColor: "hsl(var(--border))",
              color: "hsl(var(--card-foreground))",
              borderRadius: "0.5rem",
            }}
          />
          <Bar dataKey="count" name="보고서 수" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

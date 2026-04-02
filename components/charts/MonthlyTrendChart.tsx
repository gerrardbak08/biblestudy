// components/charts/MonthlyTrendChart.tsx
// Line chart showing monthly report submission trend

"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { EmptyState } from "@/components/ui/EmptyState";

interface MonthlyData {
  month: string;
  count: number;
}

export function MonthlyTrendChart({ data }: { data: MonthlyData[] }) {
  if (data.length === 0) {
    return (
      <EmptyState icon="reports" title="데이터 없음" description="보고서가 제출되면 월별 추이가 표시됩니다." />
    );
  }

  return (
    <div role="img" aria-label="월별 보고서 추이 차트">
      <ResponsiveContainer width="100%" height={250}>
        <AreaChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--chart-grid))" />
          <XAxis dataKey="month" fontSize={11} stroke="hsl(var(--chart-text))" />
          <YAxis allowDecimals={false} fontSize={11} stroke="hsl(var(--chart-text))" />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--card))",
              borderColor: "hsl(var(--border))",
              color: "hsl(var(--card-foreground))",
              borderRadius: "0.375rem",
              fontSize: "12px",
            }}
          />
          <Area
            type="monotone"
            dataKey="count"
            name="보고서 수"
            stroke="hsl(var(--chart-1))"
            fill="hsl(var(--chart-1))"
            fillOpacity={0.1}
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

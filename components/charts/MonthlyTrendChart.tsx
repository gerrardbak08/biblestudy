// components/charts/MonthlyTrendChart.tsx
// Modern area chart — smooth gradient fill, no grid

"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
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
      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(var(--chart-1))" stopOpacity={0.2} />
              <stop offset="100%" stopColor="hsl(var(--chart-1))" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="month"
            fontSize={11}
            tickLine={false}
            axisLine={false}
            stroke="hsl(var(--chart-text))"
          />
          <YAxis
            allowDecimals={false}
            fontSize={11}
            tickLine={false}
            axisLine={false}
            stroke="hsl(var(--chart-text))"
            width={30}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--card))",
              borderColor: "hsl(var(--border))",
              borderRadius: "12px",
              fontSize: "12px",
              boxShadow: "0 10px 25px -5px rgb(0 0 0 / 0.08)",
            }}
          />
          <Area
            type="monotone"
            dataKey="count"
            name="보고서 수"
            stroke="hsl(var(--chart-1))"
            fill="url(#colorCount)"
            strokeWidth={2.5}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

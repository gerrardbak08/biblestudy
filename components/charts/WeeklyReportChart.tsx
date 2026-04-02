// components/charts/WeeklyReportChart.tsx
// Modern bar chart — rounded bars, no grid, clean tooltip

"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
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
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} barSize={28}>
          <XAxis
            dataKey="week"
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
            cursor={{ fill: "hsl(var(--muted))", radius: 8 }}
            contentStyle={{
              backgroundColor: "hsl(var(--card))",
              borderColor: "hsl(var(--border))",
              borderRadius: "12px",
              fontSize: "12px",
              boxShadow: "0 10px 25px -5px rgb(0 0 0 / 0.08)",
            }}
          />
          <Bar
            dataKey="count"
            name="보고서 수"
            fill="hsl(var(--chart-1))"
            radius={[8, 8, 4, 4]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

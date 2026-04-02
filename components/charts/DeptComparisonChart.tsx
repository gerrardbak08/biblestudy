// components/charts/DeptComparisonChart.tsx
// Modern horizontal bar chart — rounded bars, clean labels

"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { EmptyState } from "@/components/ui/EmptyState";

interface DeptData {
  name: string;
  leaders: number;
  learners: number;
  reports: number;
}

export function DeptComparisonChart({ data }: { data: DeptData[] }) {
  if (data.length === 0) {
    return (
      <EmptyState
        icon="default"
        title="데이터가 없습니다"
        description="부서 데이터가 등록되면 비교 차트가 표시됩니다."
      />
    );
  }

  return (
    <div role="img" aria-label="부서별 비교 차트">
      <ResponsiveContainer width="100%" height={Math.max(220, data.length * 60)}>
        <BarChart data={data} layout="vertical" barGap={2} barSize={14}>
          <XAxis
            type="number"
            allowDecimals={false}
            fontSize={11}
            tickLine={false}
            axisLine={false}
            stroke="hsl(var(--chart-text))"
          />
          <YAxis
            type="category"
            dataKey="name"
            fontSize={12}
            width={80}
            tickLine={false}
            axisLine={false}
            stroke="hsl(var(--chart-text))"
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
          <Legend
            wrapperStyle={{ fontSize: 12, paddingTop: 8 }}
            iconType="circle"
            iconSize={8}
          />
          <Bar dataKey="leaders" name="진행자" fill="hsl(var(--chart-1))" radius={[0, 6, 6, 0]} />
          <Bar dataKey="learners" name="교육생" fill="hsl(var(--chart-2))" radius={[0, 6, 6, 0]} />
          <Bar dataKey="reports" name="보고서" fill="hsl(var(--chart-3))" radius={[0, 6, 6, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

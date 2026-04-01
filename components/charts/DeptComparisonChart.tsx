// components/charts/DeptComparisonChart.tsx
// Horizontal bar chart comparing department progress

"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
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
      <ResponsiveContainer width="100%" height={Math.max(250, data.length * 60)}>
        <BarChart data={data} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--chart-grid))" />
          <XAxis type="number" allowDecimals={false} fontSize={12} stroke="hsl(var(--chart-text))" />
          <YAxis type="category" dataKey="name" fontSize={12} width={80} stroke="hsl(var(--chart-text))" />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--card))",
              borderColor: "hsl(var(--border))",
              color: "hsl(var(--card-foreground))",
              borderRadius: "0.5rem",
            }}
          />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          <Bar dataKey="leaders" name="진행자" fill="hsl(var(--chart-1))" radius={[0, 4, 4, 0]} />
          <Bar dataKey="learners" name="교육생" fill="hsl(var(--chart-2))" radius={[0, 4, 4, 0]} />
          <Bar dataKey="reports" name="보고서" fill="hsl(var(--chart-3))" radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

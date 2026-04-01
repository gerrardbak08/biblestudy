// lib/queries/department.ts
// Data access functions for department head pages

import { prisma } from "@/lib/prisma";
import { getProgressStats } from "@/lib/progress";
import { DEPT_REPORTS_LIMIT, CHART_WEEKS } from "@/lib/constants";

/** Department dashboard stats */
export async function getDeptDashboard(departmentId: string | null) {
  const deptFilter = departmentId ?? undefined;

  const [department, totalLeaders, totalLearners, totalReports, progress] =
    await Promise.all([
      departmentId
        ? prisma.department.findUnique({ where: { id: departmentId } })
        : null,
      prisma.user.count({
        where: { role: "LEADER", departmentId: deptFilter },
      }),
      prisma.learner.count({
        where: { leader: { departmentId: deptFilter } },
      }),
      prisma.studyReport.count({
        where: { leader: { departmentId: deptFilter } },
      }),
      getProgressStats(departmentId),
    ]);

  // Weekly report chart data (scoped to department)
  const since = new Date();
  since.setDate(since.getDate() - CHART_WEEKS * 7);

  const weeklyReports = await prisma.studyReport.findMany({
    where: { leader: { departmentId: deptFilter }, weekDate: { gte: since } },
    select: { weekDate: true },
    orderBy: { weekDate: "asc" },
  });

  const weekMap = new Map<string, number>();
  for (const r of weeklyReports) {
    const week = r.weekDate.toISOString().slice(0, 10);
    weekMap.set(week, (weekMap.get(week) ?? 0) + 1);
  }
  const weeklyData = Array.from(weekMap.entries()).map(([week, count]) => ({
    week: week.slice(5),
    count,
  }));

  return { department, totalLeaders, totalLearners, totalReports, progress, weeklyData };
}

/** Leaders in a department */
export async function getDeptLeaders(departmentId: string | null) {
  return prisma.user.findMany({
    where: { role: "LEADER", departmentId: departmentId ?? undefined },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      _count: { select: { learners: true, reports: true } },
    },
    orderBy: { name: "asc" },
  });
}

/** Recent reports in a department */
export async function getDeptReports(departmentId: string | null) {
  return prisma.studyReport.findMany({
    where: { leader: { departmentId: departmentId ?? undefined } },
    select: {
      id: true,
      weekDate: true,
      attended: true,
      content: true,
      leader: { select: { name: true } },
      learner: { select: { name: true } },
      lesson: { select: { code: true, name: true } },
    },
    orderBy: { weekDate: "desc" },
    take: DEPT_REPORTS_LIMIT,
  });
}

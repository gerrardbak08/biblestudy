// lib/queries/admin.ts
// Data access functions for admin (pastor) pages

import { prisma } from "@/lib/prisma";
import { getProgressStats } from "@/lib/progress";
import { CHART_WEEKS, PAGE_SIZE } from "@/lib/constants";

/** Admin dashboard stats */
export async function getAdminDashboardData() {
  const eightWeeksAgo = new Date();
  eightWeeksAgo.setDate(eightWeeksAgo.getDate() - CHART_WEEKS * 7);

  const [totalLeaders, totalLearners, totalReports, progress, weeklyData, deptData] =
    await Promise.all([
      prisma.user.count({ where: { role: "LEADER" } }),
      prisma.learner.count(),
      prisma.studyReport.count(),
      getProgressStats(),
      getWeeklyReportData(eightWeeksAgo),
      getDeptComparisonData(),
    ]);

  return { totalLeaders, totalLearners, totalReports, progress, weeklyData, deptData };
}

/** Weekly report counts for bar chart */
async function getWeeklyReportData(since: Date) {
  const reports = await prisma.studyReport.findMany({
    where: { weekDate: { gte: since } },
    select: { weekDate: true },
    orderBy: { weekDate: "asc" },
  });

  const weekMap = new Map<string, number>();
  for (const r of reports) {
    const week = r.weekDate.toISOString().slice(0, 10);
    weekMap.set(week, (weekMap.get(week) ?? 0) + 1);
  }

  return Array.from(weekMap.entries()).map(([week, count]) => ({
    week: week.slice(5),
    count,
  }));
}

/** Department comparison data for horizontal bar chart */
async function getDeptComparisonData() {
  const departments = await prisma.department.findMany({
    select: {
      name: true,
      users: {
        where: { role: "LEADER" },
        select: {
          _count: { select: { learners: true, reports: true } },
        },
      },
    },
  });

  return departments.map((dept) => ({
    name: dept.name,
    leaders: dept.users.length,
    learners: dept.users.reduce((s, u) => s + u._count.learners, 0),
    reports: dept.users.reduce((s, u) => s + u._count.reports, 0),
  }));
}

/** Admin leaders list with counts */
export async function getAdminLeaders() {
  return prisma.user.findMany({
    where: { role: "LEADER" },
    include: {
      department: { select: { name: true } },
      _count: { select: { learners: true, reports: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

/** Admin paginated reports with leader/learner info */
export async function getAdminReports(page: number) {
  const where = {};
  const [reports, totalCount] = await Promise.all([
    prisma.studyReport.findMany({
      where,
      include: {
        leader: { select: { name: true } },
        learner: { select: { name: true } },
      },
      orderBy: { weekDate: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.studyReport.count({ where }),
  ]);

  return { reports, totalCount, totalPages: Math.ceil(totalCount / PAGE_SIZE) };
}

/** Single report detail for admin */
export async function getReportDetail(id: string) {
  return prisma.studyReport.findUnique({
    where: { id },
    include: {
      learner: { select: { name: true, phone: true } },
      leader: {
        select: { name: true, loginId: true, department: { select: { name: true } } },
      },
    },
  });
}

/** Admin progress page data */
export async function getAdminProgressData() {
  const [departments, overall] = await Promise.all([
    prisma.department.findMany({
      orderBy: { name: "asc" },
      select: {
        id: true,
        name: true,
        _count: { select: { users: true } },
      },
    }),
    getProgressStats(),
  ]);

  const deptStats = await Promise.all(
    departments.map(async (dept) => {
      const stats = await getProgressStats(dept.id);
      return {
        id: dept.id,
        name: dept.name,
        memberCount: dept._count.users,
        learnerCount: stats.learnerProgress.length,
        avgPercentage: stats.avgPercentage,
      };
    })
  );

  return { overall, deptStats };
}

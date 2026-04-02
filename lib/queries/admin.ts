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

  const [monthlyData, courseStats, missingLeaders] = await Promise.all([
    getMonthlyReportData(),
    getCourseProgressStats(),
    getMissingReportLeaders(),
  ]);

  return { totalLeaders, totalLearners, totalReports, progress, weeklyData, monthlyData, deptData, courseStats, missingLeaders };
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

/** Monthly report counts for trend chart (last 12 months) */
async function getMonthlyReportData() {
  const twelveMonthsAgo = new Date();
  twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);

  const reports = await prisma.studyReport.findMany({
    where: { weekDate: { gte: twelveMonthsAgo } },
    select: { weekDate: true },
    orderBy: { weekDate: "asc" },
  });

  const monthMap = new Map<string, number>();
  for (const r of reports) {
    const month = r.weekDate.toISOString().slice(0, 7); // YYYY-MM
    monthMap.set(month, (monthMap.get(month) ?? 0) + 1);
  }

  return Array.from(monthMap.entries()).map(([month, count]) => ({
    month: month.slice(2), // YY-MM
    count,
  }));
}

/** Course-level progress stats — basic vs advanced */
async function getCourseProgressStats() {
  const courses = await prisma.course.findMany({
    select: {
      id: true,
      name: true,
      level: true,
      sections: {
        select: {
          lessons: {
            select: {
              id: true,
              _count: { select: { reports: true } },
            },
          },
        },
      },
    },
    orderBy: { order: "asc" },
  });

  return courses.map((course) => {
    const totalLessons = course.sections.reduce((s, sec) => s + sec.lessons.length, 0);
    const lessonsWithReports = course.sections.reduce(
      (s, sec) => s + sec.lessons.filter((l) => l._count.reports > 0).length,
      0
    );
    const totalReports = course.sections.reduce(
      (s, sec) => s + sec.lessons.reduce((ls, l) => ls + l._count.reports, 0),
      0
    );

    return {
      name: course.name,
      level: course.level,
      totalLessons,
      lessonsWithReports,
      totalReports,
      completionRate: totalLessons > 0 ? Math.round((lessonsWithReports / totalLessons) * 100) : 0,
    };
  });
}

/** Leaders who haven't submitted reports this week */
async function getMissingReportLeaders() {
  const now = new Date();
  const day = now.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() + diff);
  weekStart.setHours(0, 0, 0, 0);

  const leaders = await prisma.user.findMany({
    where: { role: "LEADER" },
    select: {
      id: true,
      name: true,
      department: { select: { name: true } },
      _count: { select: { learners: true } },
      reports: {
        where: { weekDate: { gte: weekStart } },
        select: { id: true },
      },
    },
  });

  return leaders
    .filter((l) => l._count.learners > 0 && l.reports.length === 0)
    .map((l) => ({
      name: l.name,
      department: l.department?.name ?? "-",
      learnerCount: l._count.learners,
    }));
}

/** Detailed leader → learner → course progress matrix */
export async function getLeaderLearnerProgressMatrix() {
  const leaders = await prisma.user.findMany({
    where: { role: "LEADER", learners: { some: {} } },
    select: {
      id: true,
      name: true,
      department: { select: { name: true } },
      learners: {
        select: {
          id: true,
          name: true,
          reports: {
            where: { lessonId: { not: null } },
            select: {
              lessonId: true,
              lesson: {
                select: {
                  section: {
                    select: {
                      course: { select: { id: true, name: true, level: true } },
                    },
                  },
                },
              },
            },
            distinct: ["lessonId"],
          },
        },
        orderBy: { name: "asc" },
      },
    },
    orderBy: { name: "asc" },
  });

  const courses = await prisma.course.findMany({
    select: {
      id: true,
      name: true,
      level: true,
      _count: { select: { sections: true } },
      sections: { select: { _count: { select: { lessons: true } } } },
    },
    orderBy: { order: "asc" },
  });

  const courseInfo = courses.map((c) => ({
    id: c.id,
    name: c.name,
    level: c.level,
    totalLessons: c.sections.reduce((s, sec) => s + sec._count.lessons, 0),
  }));

  const matrix = leaders.map((leader) => ({
    leaderName: leader.name,
    department: leader.department?.name ?? "-",
    learners: leader.learners.map((learner) => {
      // Count completed lessons per course
      const courseProgress = new Map<string, number>();
      for (const report of learner.reports) {
        if (report.lesson) {
          const courseId = report.lesson.section.course.id;
          courseProgress.set(courseId, (courseProgress.get(courseId) ?? 0) + 1);
        }
      }

      return {
        name: learner.name,
        totalCompleted: learner.reports.length,
        courses: courseInfo.map((c) => ({
          courseId: c.id,
          courseName: c.name,
          level: c.level,
          completed: courseProgress.get(c.id) ?? 0,
          total: c.totalLessons,
          percentage: c.totalLessons > 0
            ? Math.round(((courseProgress.get(c.id) ?? 0) / c.totalLessons) * 100)
            : 0,
        })),
      };
    }),
  }));

  return { matrix, courseInfo };
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

// lib/progress.ts
// Shared helpers for curriculum progress calculation

import { prisma } from "@/lib/prisma";

// Returns progress stats for learners scoped by optional departmentId filter
export async function getProgressStats(departmentId?: string | null) {
  const leaderWhere = departmentId ? { departmentId } : {};

  const [totalLessons, learners] = await Promise.all([
    prisma.lesson.count(),
    prisma.learner.findMany({
      where: { leader: leaderWhere },
      select: {
        id: true,
        name: true,
        leader: { select: { name: true, departmentId: true } },
        reports: {
          where: { lessonId: { not: null } },
          select: { lessonId: true },
          distinct: ["lessonId"],
        },
      },
    }),
  ]);

  const learnerProgress = learners.map((learner) => ({
    id: learner.id,
    name: learner.name,
    leaderName: learner.leader.name,
    completedLessons: learner.reports.length,
    totalLessons,
    percentage: totalLessons > 0
      ? Math.round((learner.reports.length / totalLessons) * 100)
      : 0,
  }));

  const avgPercentage = learnerProgress.length > 0
    ? Math.round(
        learnerProgress.reduce((sum, l) => sum + l.percentage, 0) /
          learnerProgress.length
      )
    : 0;

  return { learnerProgress, totalLessons, avgPercentage };
}

// Returns per-learner lesson completion detail for a single learner
export async function getLearnerProgress(learnerId: string) {
  const [courses, completedReports] = await Promise.all([
    prisma.course.findMany({
      orderBy: { order: "asc" },
      include: {
        sections: {
          orderBy: { order: "asc" },
          include: {
            lessons: { orderBy: { order: "asc" } },
          },
        },
      },
    }),
    prisma.studyReport.findMany({
      where: { learnerId, lessonId: { not: null } },
      select: { lessonId: true, weekDate: true },
    }),
  ]);

  const completedSet = new Set(
    completedReports.map((r) => r.lessonId).filter(Boolean)
  );

  const coursesWithProgress = courses.map((course) => {
    const sections = course.sections.map((section) => {
      const lessons = section.lessons.map((lesson) => ({
        ...lesson,
        completed: completedSet.has(lesson.id),
      }));
      return {
        ...section,
        lessons,
        completedCount: lessons.filter((l) => l.completed).length,
        totalCount: lessons.length,
      };
    });
    const totalLessons = sections.reduce((s, sec) => s + sec.totalCount, 0);
    const completedLessons = sections.reduce((s, sec) => s + sec.completedCount, 0);
    return {
      ...course,
      sections,
      totalLessons,
      completedLessons,
      percentage: totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0,
    };
  });

  return coursesWithProgress;
}

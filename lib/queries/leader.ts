// lib/queries/leader.ts
// Data access functions for leader pages

import { prisma } from "@/lib/prisma";
import { PAGE_SIZE } from "@/lib/constants";

/** Leader dashboard data — learners with weekly submission status */
export async function getLeaderDashboard(leaderId: string) {
  const now = new Date();
  const day = now.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() + diff);
  weekStart.setHours(0, 0, 0, 0);

  const [learners, thisWeekReports, totalReports] = await Promise.all([
    prisma.learner.findMany({
      where: { leaderId },
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    }),
    prisma.studyReport.findMany({
      where: { leaderId, weekDate: { gte: weekStart } },
      select: { learnerId: true },
    }),
    prisma.studyReport.count({ where: { leaderId } }),
  ]);

  const submittedIds = new Set(thisWeekReports.map((r) => r.learnerId));
  const learnerStatuses = learners.map((l) => ({
    id: l.id,
    name: l.name,
    submitted: submittedIds.has(l.id),
  }));

  return { learnerStatuses, totalReports };
}

/** Leader's learners with report counts */
export async function getLeaderLearners(leaderId: string) {
  return prisma.learner.findMany({
    where: { leaderId },
    include: { _count: { select: { reports: true } } },
    orderBy: { createdAt: "desc" },
  });
}

/** Single learner for detail/edit — with ownership check */
export async function getLearnerById(id: string) {
  return prisma.learner.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      phone: true,
      notes: true,
      leaderId: true,
      createdAt: true,
    },
  });
}

/** Leader's paginated reports */
export async function getLeaderReports(leaderId: string, page: number) {
  const where = { leaderId };
  const [reports, totalCount] = await Promise.all([
    prisma.studyReport.findMany({
      where,
      include: { learner: { select: { name: true } } },
      orderBy: { weekDate: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.studyReport.count({ where }),
  ]);

  return { reports, totalCount, totalPages: Math.ceil(totalCount / PAGE_SIZE) };
}

/** Single report detail — with leader ownership info */
export async function getLeaderReportDetail(id: string) {
  return prisma.studyReport.findUnique({
    where: { id },
    include: {
      learner: { select: { name: true, phone: true } },
      leader: { select: { name: true } },
    },
  });
}

/** Report form data — learners + curriculum lessons for a leader */
export async function getReportFormData(leaderId: string) {
  const [learners, lessons] = await Promise.all([
    prisma.learner.findMany({
      where: { leaderId },
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    }),
    prisma.lesson.findMany({
      select: {
        id: true,
        code: true,
        name: true,
        order: true,
        section: {
          select: {
            code: true,
            name: true,
            order: true,
            course: { select: { name: true, level: true, order: true } },
          },
        },
      },
      orderBy: [
        { section: { course: { order: "asc" } } },
        { section: { order: "asc" } },
        { order: "asc" },
      ],
    }),
  ]);

  return { learners, lessons };
}

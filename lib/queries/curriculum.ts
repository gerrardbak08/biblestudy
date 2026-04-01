// lib/queries/curriculum.ts
// Data access functions for curriculum management

import { prisma } from "@/lib/prisma";

/** All courses with section/lesson counts */
export async function getCurriculumList() {
  return prisma.course.findMany({
    include: {
      _count: { select: { sections: true } },
      sections: {
        select: { _count: { select: { lessons: true } } },
      },
    },
    orderBy: { order: "asc" },
  });
}

/** Single course with full section → lesson tree */
export async function getCourseDetail(id: string) {
  return prisma.course.findUnique({
    where: { id },
    include: {
      sections: {
        orderBy: { order: "asc" },
        include: {
          lessons: {
            orderBy: { order: "asc" },
          },
        },
      },
    },
  });
}

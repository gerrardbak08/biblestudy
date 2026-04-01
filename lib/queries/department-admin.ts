// lib/queries/department-admin.ts
// Admin-level department data access functions

import { prisma } from "@/lib/prisma";

/** All departments with member counts */
export async function getAdminDepartments() {
  return prisma.department.findMany({
    include: {
      _count: { select: { users: true } },
    },
    orderBy: { name: "asc" },
  });
}

/** Single department by ID */
export async function getDepartmentByIdAdmin(id: string) {
  return prisma.department.findUnique({
    where: { id },
    include: {
      _count: { select: { users: true } },
    },
  });
}

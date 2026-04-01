// lib/actions/department.ts
// Server Actions for department management (admin-only)

"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { departmentSchema, idSchema } from "@/lib/validations";
import { redirect } from "next/navigation";
import type { FormState } from "@/types/form";

export async function createDepartment(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") redirect("/login");

  const result = departmentSchema.safeParse({ name: formData.get("name") });
  if (!result.success) {
    return { errors: result.error.flatten().fieldErrors };
  }

  const existing = await prisma.department.findUnique({
    where: { name: result.data.name },
  });
  if (existing) {
    return { errors: { name: ["이미 존재하는 부서명입니다."] } };
  }

  await prisma.department.create({ data: { name: result.data.name } });
  redirect("/admin/departments");
}

export async function updateDepartment(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") redirect("/login");

  const id = formData.get("id") as string;
  const parsedId = idSchema.safeParse(id);
  if (!parsedId.success) return { errors: {}, message: "유효하지 않은 ID입니다." };

  const result = departmentSchema.safeParse({ name: formData.get("name") });
  if (!result.success) {
    return { errors: result.error.flatten().fieldErrors };
  }

  // Check name uniqueness excluding self
  const existing = await prisma.department.findFirst({
    where: { name: result.data.name, NOT: { id: parsedId.data } },
  });
  if (existing) {
    return { errors: { name: ["이미 존재하는 부서명입니다."] } };
  }

  await prisma.department.update({
    where: { id: parsedId.data },
    data: { name: result.data.name },
  });

  redirect("/admin/departments");
}

export async function deleteDepartment(id: string): Promise<void> {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") redirect("/login");

  const parsed = idSchema.safeParse(id);
  if (!parsed.success) redirect("/admin/departments");

  // Check if department has members
  const memberCount = await prisma.user.count({
    where: { departmentId: parsed.data },
  });
  if (memberCount > 0) {
    // Cannot delete — has members. Redirect back (action doesn't support returning errors for non-form actions)
    redirect("/admin/departments");
  }

  await prisma.department.delete({ where: { id: parsed.data } });
  redirect("/admin/departments");
}

// lib/actions/leader.ts
// Server Actions for leader account management (admin-only)

"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createLeaderSchema, updateLeaderSchema, idSchema } from "@/lib/validations";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import type { FormState } from "@/types/form";

// Creates a new leader account — only callable by ADMIN users
export async function createLeader(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const session = await auth();
  // Guard: only admins can create leader accounts
  if (!session || session.user.role !== "ADMIN") redirect("/login");

  const raw = {
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    phone: formData.get("phone") || undefined,
    departmentId: formData.get("departmentId") || undefined,
  };

  const result = createLeaderSchema.safeParse(raw);
  if (!result.success) {
    return { errors: result.error.flatten().fieldErrors };
  }

  const { name, email, password, phone, departmentId } = result.data;

  // Check email uniqueness before attempting insert
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return {
      errors: { email: ["이미 사용 중인 이메일입니다."] },
    };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role: "LEADER",
      phone: phone || null,
      departmentId: departmentId || null,
    },
  });

  redirect("/admin/leaders");
}

// Updates a leader's info — only callable by ADMIN
export async function updateLeader(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") redirect("/login");

  const id = formData.get("id") as string;
  const parsedId = idSchema.safeParse(id);
  if (!parsedId.success) return { errors: {}, message: "유효하지 않은 ID입니다." };

  const raw = {
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone") || undefined,
    departmentId: formData.get("departmentId") || undefined,
    role: formData.get("role") || undefined,
  };

  const result = updateLeaderSchema.safeParse(raw);
  if (!result.success) {
    return { errors: result.error.flatten().fieldErrors };
  }

  const { name, email, phone, departmentId, role } = result.data;

  // Check email uniqueness excluding self
  const existing = await prisma.user.findFirst({
    where: { email, NOT: { id: parsedId.data } },
  });
  if (existing) {
    return { errors: { email: ["이미 사용 중인 이메일입니다."] } };
  }

  await prisma.user.update({
    where: { id: parsedId.data },
    data: {
      name,
      email,
      phone: phone || null,
      departmentId: departmentId || null,
      role: role ?? "LEADER",
    },
  });

  redirect("/admin/leaders");
}

// Deletes a leader account and cascades — only callable by ADMIN
export async function deleteLeader(id: string): Promise<void> {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") redirect("/login");

  const parsed = idSchema.safeParse(id);
  if (!parsed.success) redirect("/admin/leaders");

  // Cannot delete self
  if (parsed.data === session.user.id) redirect("/admin/leaders");

  await prisma.user.delete({ where: { id: parsed.data } });
  redirect("/admin/leaders");
}

// Resets a leader's password to a temporary one — only callable by ADMIN
export async function resetLeaderPassword(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") redirect("/login");

  const id = formData.get("id") as string;
  const parsedId = idSchema.safeParse(id);
  if (!parsedId.success) return { errors: {}, message: "유효하지 않은 ID입니다." };

  const tempPassword = "temp" + Math.random().toString(36).slice(2, 10);
  const hashed = await bcrypt.hash(tempPassword, 10);

  await prisma.user.update({
    where: { id: parsedId.data },
    data: { password: hashed },
  });

  return { errors: {}, message: `임시 비밀번호: ${tempPassword}` };
}

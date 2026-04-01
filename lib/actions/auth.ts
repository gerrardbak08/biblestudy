// lib/actions/auth.ts
// Server Actions for authentication management

"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { changePasswordSchema, signupSchema } from "@/lib/validations";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import type { FormState } from "@/types/form";

// Sign up — creates a new LEADER account with department
export async function signup(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const raw = {
    loginId: formData.get("loginId"),
    password: formData.get("password"),
    name: formData.get("name"),
    departmentId: formData.get("departmentId"),
  };

  const result = signupSchema.safeParse(raw);
  if (!result.success) {
    return { errors: result.error.flatten().fieldErrors };
  }

  const { loginId, password, name, departmentId } = result.data;

  const existing = await prisma.user.findUnique({ where: { loginId } });
  if (existing) {
    return { errors: { loginId: ["이미 사용 중인 아이디입니다."] } };
  }

  // departmentId may be a department name from signup form — find actual ID
  const department = await prisma.department.findFirst({
    where: { OR: [{ id: departmentId }, { name: departmentId }] },
  });
  if (!department) {
    return { errors: { departmentId: ["유효하지 않은 소속입니다."] } };
  }

  const hashed = await bcrypt.hash(password, 10);
  await prisma.user.create({
    data: {
      loginId,
      password: hashed,
      name,
      role: "LEADER",
      departmentId: department.id,
    },
  });

  redirect("/login");
}

// Changes the currently authenticated user's password
export async function changePassword(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const session = await auth();
  if (!session) redirect("/login");

  const raw = {
    currentPassword: formData.get("currentPassword"),
    newPassword: formData.get("newPassword"),
    confirmPassword: formData.get("confirmPassword"),
  };

  const result = changePasswordSchema.safeParse(raw);
  if (!result.success) {
    return { errors: result.error.flatten().fieldErrors };
  }

  const { currentPassword, newPassword } = result.data;

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { password: true },
  });

  if (!user) {
    return { errors: {}, message: "사용자를 찾을 수 없습니다." };
  }

  const isValid = await bcrypt.compare(currentPassword, user.password);
  if (!isValid) {
    return { errors: { currentPassword: ["현재 비밀번호가 일치하지 않습니다."] } };
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  await prisma.user.update({
    where: { id: session.user.id },
    data: { password: hashedPassword },
  });

  return { errors: {}, message: "비밀번호가 변경되었습니다." };
}

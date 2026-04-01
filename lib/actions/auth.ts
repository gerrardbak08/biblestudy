// lib/actions/auth.ts
// Server Actions for authentication management

"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { changePasswordSchema } from "@/lib/validations";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import type { FormState } from "@/types/form";

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

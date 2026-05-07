// lib/actions/auth.ts
// Server Actions for authentication management

"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { loginSchema, changePasswordSchema, signupSchema } from "@/lib/validations";
import { signIn } from "@/lib/auth";
import { AuthError } from "next-auth";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import type { FormState } from "@/types/form";

// Server-side login — signIn sets cookie + throws NEXT_REDIRECT (303 GET)
export async function login(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const raw = {
    loginId: formData.get("loginId"),
    password: formData.get("password"),
  };

  const result = loginSchema.safeParse(raw);
  if (!result.success) {
    return { errors: result.error.flatten().fieldErrors };
  }

  try {
    await signIn("credentials", {
      loginId: result.data.loginId,
      password: result.data.password,
      redirectTo: "/",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return { errors: {}, message: "아이디 또는 비밀번호가 올바르지 않습니다." };
    }
    throw error; // NEXT_REDIRECT — must re-throw for Next.js to handle
  }

  return { errors: {} }; // unreachable on success (redirect happens)
}

// Sign up — creates a new LEADER account, then signs in immediately
export async function signup(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const raw = {
    loginId: formData.get("loginId"),
    password: formData.get("password"),
    name: formData.get("name"),
    departmentName: formData.get("departmentName"),
  };

  const result = signupSchema.safeParse(raw);
  if (!result.success) {
    return { errors: result.error.flatten().fieldErrors };
  }

  const { loginId, password, name, departmentName } = result.data;

  const existing = await prisma.user.findUnique({ where: { loginId } });
  if (existing) {
    return { errors: { loginId: ["이미 사용 중인 아이디입니다."] } };
  }

  const normalizedDepartmentName = departmentName.trim();
  const department = await prisma.department.upsert({
    where: { name: normalizedDepartmentName },
    update: {},
    create: { name: normalizedDepartmentName },
  });

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

  try {
    await signIn("credentials", {
      loginId,
      password,
      redirectTo: "/",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return {
        errors: {},
        message: "가입은 완료되었지만 자동 로그인에 실패했습니다. 로그인 화면에서 다시 로그인해주세요.",
      };
    }
    throw error;
  }

  return { errors: {} };
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

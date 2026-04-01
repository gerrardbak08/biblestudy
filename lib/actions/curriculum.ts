// lib/actions/curriculum.ts
// Server Actions for curriculum management (admin-only)
// Handles Course, Section, and Lesson CRUD operations

"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { courseSchema, sectionSchema, lessonSchema, idSchema } from "@/lib/validations";
import { redirect } from "next/navigation";
import type { FormState } from "@/types/form";

// ─── Course ───

export async function createCourse(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") redirect("/login");

  const result = courseSchema.safeParse({
    name: formData.get("name"),
    level: formData.get("level"),
    order: formData.get("order"),
  });
  if (!result.success) return { errors: result.error.flatten().fieldErrors };

  const existing = await prisma.course.findUnique({ where: { name: result.data.name } });
  if (existing) return { errors: { name: ["이미 존재하는 과정명입니다."] } };

  await prisma.course.create({ data: result.data });
  redirect("/admin/curriculum");
}

export async function updateCourse(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") redirect("/login");

  const id = formData.get("id") as string;
  const parsedId = idSchema.safeParse(id);
  if (!parsedId.success) return { errors: {}, message: "유효하지 않은 ID입니다." };

  const result = courseSchema.safeParse({
    name: formData.get("name"),
    level: formData.get("level"),
    order: formData.get("order"),
  });
  if (!result.success) return { errors: result.error.flatten().fieldErrors };

  const existing = await prisma.course.findFirst({
    where: { name: result.data.name, NOT: { id: parsedId.data } },
  });
  if (existing) return { errors: { name: ["이미 존재하는 과정명입니다."] } };

  await prisma.course.update({ where: { id: parsedId.data }, data: result.data });
  redirect("/admin/curriculum");
}

export async function deleteCourse(id: string): Promise<void> {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") redirect("/login");

  const parsed = idSchema.safeParse(id);
  if (!parsed.success) redirect("/admin/curriculum");

  await prisma.course.delete({ where: { id: parsed.data } });
  redirect("/admin/curriculum");
}

// ─── Section ───

export async function createSection(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") redirect("/login");

  const result = sectionSchema.safeParse({
    code: formData.get("code"),
    name: formData.get("name"),
    order: formData.get("order"),
    courseId: formData.get("courseId"),
  });
  if (!result.success) return { errors: result.error.flatten().fieldErrors };

  await prisma.section.create({ data: result.data });
  redirect(`/admin/curriculum/${result.data.courseId}`);
}

export async function updateSection(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") redirect("/login");

  const id = formData.get("id") as string;
  const parsedId = idSchema.safeParse(id);
  if (!parsedId.success) return { errors: {}, message: "유효하지 않은 ID입니다." };

  const result = sectionSchema.safeParse({
    code: formData.get("code"),
    name: formData.get("name"),
    order: formData.get("order"),
    courseId: formData.get("courseId"),
  });
  if (!result.success) return { errors: result.error.flatten().fieldErrors };

  await prisma.section.update({
    where: { id: parsedId.data },
    data: { code: result.data.code, name: result.data.name, order: result.data.order },
  });
  redirect(`/admin/curriculum/${result.data.courseId}`);
}

export async function deleteSection(id: string, courseId: string): Promise<void> {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") redirect("/login");

  const parsed = idSchema.safeParse(id);
  if (!parsed.success) redirect("/admin/curriculum");

  await prisma.section.delete({ where: { id: parsed.data } });
  redirect(`/admin/curriculum/${courseId}`);
}

// ─── Lesson ───

export async function createLesson(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") redirect("/login");

  const result = lessonSchema.safeParse({
    code: formData.get("code"),
    name: formData.get("name"),
    order: formData.get("order"),
    sectionId: formData.get("sectionId"),
  });
  if (!result.success) return { errors: result.error.flatten().fieldErrors };

  const section = await prisma.section.findUnique({
    where: { id: result.data.sectionId },
    select: { courseId: true },
  });

  await prisma.lesson.create({ data: result.data });
  redirect(`/admin/curriculum/${section?.courseId ?? ""}`);
}

export async function updateLesson(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") redirect("/login");

  const id = formData.get("id") as string;
  const parsedId = idSchema.safeParse(id);
  if (!parsedId.success) return { errors: {}, message: "유효하지 않은 ID입니다." };

  const result = lessonSchema.safeParse({
    code: formData.get("code"),
    name: formData.get("name"),
    order: formData.get("order"),
    sectionId: formData.get("sectionId"),
  });
  if (!result.success) return { errors: result.error.flatten().fieldErrors };

  await prisma.lesson.update({
    where: { id: parsedId.data },
    data: { code: result.data.code, name: result.data.name, order: result.data.order },
  });

  const section = await prisma.section.findUnique({
    where: { id: result.data.sectionId },
    select: { courseId: true },
  });
  redirect(`/admin/curriculum/${section?.courseId ?? ""}`);
}

export async function deleteLesson(id: string, courseId: string): Promise<void> {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") redirect("/login");

  const parsed = idSchema.safeParse(id);
  if (!parsed.success) redirect("/admin/curriculum");

  await prisma.lesson.delete({ where: { id: parsed.data } });
  redirect(`/admin/curriculum/${courseId}`);
}

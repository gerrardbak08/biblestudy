// lib/actions/report.ts
// Server Actions for study report management (used by leader-role users)

"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { reportSchema, idSchema } from "@/lib/validations";
import { redirect } from "next/navigation";
import type { FormState } from "@/types/form";

// Creates a new weekly study report for a learner
export async function createReport(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const session = await auth();
  if (!session) redirect("/login");
  if (session.user.role !== "LEADER") redirect("/");

  const raw = {
    learnerId: formData.get("learnerId"),
    lessonId: formData.get("lessonId") || undefined,
    weekDate: formData.get("weekDate"),
    attended: formData.get("attended"),
    content: formData.get("content"),
    notes: formData.get("notes") || undefined,
    progressStatus: formData.get("progressStatus") || undefined,
    understandingLevel: formData.get("understandingLevel"),
    participationLevel: formData.get("participationLevel"),
    careLevel: formData.get("careLevel"),
    nextPlan: formData.get("nextPlan") || undefined,
  };

  const result = reportSchema.safeParse(raw);
  if (!result.success) {
    return { errors: result.error.flatten().fieldErrors };
  }

  const data = result.data;

  try {
    await prisma.studyReport.create({
      data: {
        weekDate: new Date(data.weekDate),
        attended: data.attended === "true",
        content: data.content,
        notes: data.notes || null,
        progressStatus: data.progressStatus || null,
        understandingLevel: data.understandingLevel ?? null,
        participationLevel: data.participationLevel ?? null,
        careLevel: data.careLevel ?? null,
        nextPlan: data.nextPlan || null,
        learnerId: data.learnerId,
        leaderId: session.user.id,
        lessonId: data.lessonId || null,
      },
    });
  } catch (err: unknown) {
    // Prisma unique constraint violation: same learner + same week already reported
    if (
      err instanceof Error &&
      err.message.includes("Unique constraint failed")
    ) {
      return {
        errors: {},
        message: "해당 교육생의 이번 주 보고서가 이미 존재합니다.",
      };
    }
    throw err;
  }

  redirect("/leader/reports");
}

// Updates an existing study report (leader can only update their own)
export async function updateReport(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const session = await auth();
  if (!session) redirect("/login");
  if (session.user.role !== "LEADER") redirect("/");

  const id = formData.get("id") as string;
  if (!id) return { errors: {}, message: "보고서 ID가 누락되었습니다." };

  // Verify ownership
  const existing = await prisma.studyReport.findUnique({ where: { id } });
  if (!existing || existing.leaderId !== session.user.id) {
    return { errors: {}, message: "권한이 없습니다." };
  }

  const raw = {
    learnerId: formData.get("learnerId"),
    lessonId: formData.get("lessonId") || undefined,
    weekDate: formData.get("weekDate"),
    attended: formData.get("attended"),
    content: formData.get("content"),
    notes: formData.get("notes") || undefined,
    progressStatus: formData.get("progressStatus") || undefined,
    understandingLevel: formData.get("understandingLevel"),
    participationLevel: formData.get("participationLevel"),
    careLevel: formData.get("careLevel"),
    nextPlan: formData.get("nextPlan") || undefined,
  };

  const result = reportSchema.safeParse(raw);
  if (!result.success) {
    return { errors: result.error.flatten().fieldErrors };
  }

  const data = result.data;

  try {
    await prisma.studyReport.update({
      where: { id },
      data: {
        weekDate: new Date(data.weekDate),
        attended: data.attended === "true",
        content: data.content,
        notes: data.notes || null,
        progressStatus: data.progressStatus || null,
        understandingLevel: data.understandingLevel ?? null,
        participationLevel: data.participationLevel ?? null,
        careLevel: data.careLevel ?? null,
        nextPlan: data.nextPlan || null,
        learnerId: data.learnerId,
        lessonId: data.lessonId || null,
      },
    });
  } catch (err: unknown) {
    if (
      err instanceof Error &&
      err.message.includes("Unique constraint failed")
    ) {
      return {
        errors: {},
        message: "해당 교육생의 해당 주차 보고서가 이미 존재합니다.",
      };
    }
    throw err;
  }

  redirect(`/leader/reports/${id}`);
}

// Deletes a report (leader can only delete their own)
export async function deleteReport(id: string): Promise<void> {
  const session = await auth();
  if (!session) redirect("/login");
  if (session.user.role !== "LEADER") redirect("/");

  const parsed = idSchema.safeParse(id);
  if (!parsed.success) redirect("/leader/reports");

  const existing = await prisma.studyReport.findUnique({ where: { id: parsed.data } });
  if (!existing || existing.leaderId !== session.user.id) {
    redirect("/leader/reports");
  }

  await prisma.studyReport.delete({ where: { id: parsed.data } });
  redirect("/leader/reports");
}

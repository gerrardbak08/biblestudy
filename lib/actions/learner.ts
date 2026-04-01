// lib/actions/learner.ts
// Server Actions for learner management (used by leader-role users)

"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { learnerSchema, idSchema } from "@/lib/validations";
import { redirect } from "next/navigation";
import type { FormState } from "@/types/form";

// Creates a new learner under the currently authenticated leader
export async function createLearner(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const session = await auth();
  if (!session) redirect("/login");
  if (session.user.role !== "LEADER") redirect("/");

  const raw = {
    name: formData.get("name"),
    phone: formData.get("phone") || undefined,
    notes: formData.get("notes") || undefined,
  };

  const result = learnerSchema.safeParse(raw);
  if (!result.success) {
    return { errors: result.error.flatten().fieldErrors };
  }

  const { name, phone, notes } = result.data;

  await prisma.learner.create({
    data: {
      name,
      phone: phone || null,
      notes: notes || null,
      leaderId: session.user.id,
    },
  });

  redirect("/leader/learners");
}

// Updates an existing learner's details
export async function updateLearner(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const session = await auth();
  if (!session) redirect("/login");
  if (session.user.role !== "LEADER") redirect("/");

  const id = formData.get("id") as string;
  if (!id) return { errors: {}, message: "교육생 ID가 누락되었습니다." };

  // Verify ownership
  const existing = await prisma.learner.findUnique({ where: { id } });
  if (!existing || existing.leaderId !== session.user.id) {
    return { errors: {}, message: "권한이 없습니다." };
  }

  const raw = {
    name: formData.get("name"),
    phone: formData.get("phone") || undefined,
    notes: formData.get("notes") || undefined,
  };

  const result = learnerSchema.safeParse(raw);
  if (!result.success) {
    return { errors: result.error.flatten().fieldErrors };
  }

  const { name, phone, notes } = result.data;

  await prisma.learner.update({
    where: { id },
    data: {
      name,
      phone: phone || null,
      notes: notes || null,
    },
  });

  redirect(`/leader/learners/${id}`);
}

// Deletes a learner and all their reports (cascade)
export async function deleteLearner(id: string): Promise<void> {
  const session = await auth();
  if (!session) redirect("/login");
  if (session.user.role !== "LEADER") redirect("/");

  const parsed = idSchema.safeParse(id);
  if (!parsed.success) redirect("/leader/learners");

  const existing = await prisma.learner.findUnique({ where: { id: parsed.data } });
  if (!existing || existing.leaderId !== session.user.id) {
    redirect("/leader/learners");
  }

  await prisma.learner.delete({ where: { id: parsed.data } });
  redirect("/leader/learners");
}

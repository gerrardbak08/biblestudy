// components/forms/SectionLessonForm.tsx
// Inline forms for adding sections and lessons within a course detail page

"use client";

import { useActionState, useEffect } from "react";
import { createSection, createLesson, updateSection, updateLesson } from "@/lib/actions/curriculum";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FieldError } from "@/components/forms/FieldError";
import { toast } from "sonner";
import type { FormState } from "@/types/form";

const initialState: FormState = { errors: {} };

export function AddSectionForm({ courseId }: { courseId: string }) {
  const [state, formAction, isPending] = useActionState(createSection, initialState);

  useEffect(() => {
    if (state.message) toast.error(state.message);
  }, [state]);

  return (
    <form action={formAction} className="flex items-end gap-2 flex-wrap">
      <input type="hidden" name="courseId" value={courseId} />
      <div className="space-y-1">
        <Label htmlFor="sec-code">코드</Label>
        <Input id="sec-code" name="code" placeholder="1" className="w-20" />
        <FieldError errors={state.errors.code} />
      </div>
      <div className="space-y-1 flex-1 min-w-[120px]">
        <Label htmlFor="sec-name">단원명</Label>
        <Input id="sec-name" name="name" placeholder="회개하고 복음을 믿으라" />
        <FieldError errors={state.errors.name} />
      </div>
      <div className="space-y-1">
        <Label htmlFor="sec-order">순서</Label>
        <Input id="sec-order" name="order" type="number" min="0" defaultValue="0" className="w-20" />
      </div>
      <Button type="submit" size="sm" disabled={isPending}>
        {isPending ? "추가 중..." : "단원 추가"}
      </Button>
    </form>
  );
}

export function AddLessonForm({ sectionId }: { sectionId: string }) {
  const [state, formAction, isPending] = useActionState(createLesson, initialState);

  useEffect(() => {
    if (state.message) toast.error(state.message);
  }, [state]);

  return (
    <form action={formAction} className="flex items-end gap-2 flex-wrap">
      <input type="hidden" name="sectionId" value={sectionId} />
      <div className="space-y-1">
        <Label htmlFor={`les-code-${sectionId}`}>코드</Label>
        <Input id={`les-code-${sectionId}`} name="code" placeholder="1-01" className="w-24" />
        <FieldError errors={state.errors.code} />
      </div>
      <div className="space-y-1 flex-1 min-w-[120px]">
        <Label htmlFor={`les-name-${sectionId}`}>레슨명</Label>
        <Input id={`les-name-${sectionId}`} name="name" placeholder="나는 누구인가" />
        <FieldError errors={state.errors.name} />
      </div>
      <div className="space-y-1">
        <Label htmlFor={`les-order-${sectionId}`}>순서</Label>
        <Input id={`les-order-${sectionId}`} name="order" type="number" min="0" defaultValue="0" className="w-20" />
      </div>
      <Button type="submit" size="sm" variant="outline" disabled={isPending}>
        {isPending ? "추가 중..." : "레슨 추가"}
      </Button>
    </form>
  );
}

export function EditSectionForm({ section, courseId }: { section: { id: string; code: string; name: string; order: number }; courseId: string }) {
  const [state, formAction, isPending] = useActionState(updateSection, initialState);

  useEffect(() => {
    if (state.message) toast.error(state.message);
  }, [state]);

  return (
    <form action={formAction} className="flex items-end gap-2 flex-wrap">
      <input type="hidden" name="id" value={section.id} />
      <input type="hidden" name="courseId" value={courseId} />
      <div className="space-y-1">
        <Label>코드</Label>
        <Input name="code" defaultValue={section.code} className="w-20" />
        <FieldError errors={state.errors.code} />
      </div>
      <div className="space-y-1 flex-1 min-w-[120px]">
        <Label>단원명</Label>
        <Input name="name" defaultValue={section.name} />
        <FieldError errors={state.errors.name} />
      </div>
      <div className="space-y-1">
        <Label>순서</Label>
        <Input name="order" type="number" min="0" defaultValue={section.order} className="w-20" />
      </div>
      <Button type="submit" size="sm" variant="secondary" disabled={isPending}>
        {isPending ? "수정 중..." : "단원 수정"}
      </Button>
    </form>
  );
}

export function EditLessonForm({ lesson, sectionId }: { lesson: { id: string; code: string; name: string; order: number }; sectionId: string }) {
  const [state, formAction, isPending] = useActionState(updateLesson, initialState);

  useEffect(() => {
    if (state.message) toast.error(state.message);
  }, [state]);

  return (
    <form action={formAction} className="flex items-end gap-2 flex-wrap">
      <input type="hidden" name="id" value={lesson.id} />
      <input type="hidden" name="sectionId" value={sectionId} />
      <div className="space-y-1">
        <Input name="code" defaultValue={lesson.code} className="w-24" />
      </div>
      <div className="space-y-1 flex-1 min-w-[120px]">
        <Input name="name" defaultValue={lesson.name} />
      </div>
      <div className="space-y-1">
        <Input name="order" type="number" min="0" defaultValue={lesson.order} className="w-20" />
      </div>
      <Button type="submit" size="sm" variant="ghost" disabled={isPending}>
        {isPending ? "..." : "저장"}
      </Button>
    </form>
  );
}

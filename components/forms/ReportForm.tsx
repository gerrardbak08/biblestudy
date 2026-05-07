// components/forms/ReportForm.tsx
// Client-side form for submitting a weekly study report.
// shadcn Select components don't emit native form values, so their selected
// values are tracked in state and passed via hidden inputs to the Server Action.

"use client";

import { useActionState, useState, useEffect } from "react";
import { createReport, updateReport } from "@/lib/actions/report";
import { toast } from "sonner";
import { FieldError } from "@/components/forms/FieldError";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { FormState } from "@/types/form";

const selectClassName =
  "h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

// Simple 1–5 level select using a native <select> — keeps the implementation lean
function LevelSelect({
  name,
  label,
  defaultValue,
  helperText,
}: {
  name: string;
  label: string;
  defaultValue?: number | null;
  helperText?: string;
}) {
  return (
    <div className="space-y-1">
      <Label htmlFor={name}>{label}</Label>
      {helperText && (
        <p className="text-[11px] leading-snug text-muted-foreground">{helperText}</p>
      )}
      <select
        id={name}
        name={name}
        defaultValue={defaultValue ?? ""}
        className={selectClassName}
      >
        <option value="">선택 안 함</option>
        {[1, 2, 3, 4, 5].map((n) => (
          <option key={n} value={n}>
            {n}점
          </option>
        ))}
      </select>
    </div>
  );
}

interface LessonOption {
  id: string;
  code: string;
  name: string;
  section: {
    code: string;
    name: string;
    course: { name: string; level: string };
  };
}

interface ReportDefaults {
  id?: string;
  learnerId?: string;
  weekDate?: string;
  attended?: string;
  content?: string;
  notes?: string;
  progressStatus?: string;
  understandingLevel?: number | null;
  participationLevel?: number | null;
  careLevel?: number | null;
  nextPlan?: string;
  lessonId?: string;
}

interface ReportFormProps {
  learners: { id: string; name: string }[];
  lessons: LessonOption[];
  defaultValues?: ReportDefaults;
  mode?: "create" | "edit";
}

const initialState: FormState = { errors: {} };

export function ReportForm({ learners, lessons, defaultValues, mode = "create" }: ReportFormProps) {
  const action = mode === "edit" ? updateReport : createReport;
  const [state, formAction, isPending] = useActionState(
    action,
    initialState
  );

  useEffect(() => {
    if (state.message) toast.error(state.message);
  }, [state]);

  // Derive initial course/section from defaultValues lessonId
  const defaultLesson = defaultValues?.lessonId
    ? lessons.find((l) => l.id === defaultValues.lessonId)
    : undefined;

  // Cascading lesson selection: course → section → lesson
  const [selectedCourse, setSelectedCourse] = useState(defaultLesson?.section.course.name ?? "");
  const [selectedSection, setSelectedSection] = useState(defaultLesson?.section.code ?? "");
  const [selectedLessonId, setSelectedLessonId] = useState(defaultValues?.lessonId ?? "");

  // Derive unique courses
  const courses = Array.from(
    new Map(
      lessons.map((l) => [
        l.section.course.name,
        { name: l.section.course.name, level: l.section.course.level },
      ])
    ).values()
  );

  // Derive sections for selected course
  const sections = selectedCourse
    ? Array.from(
        new Map(
          lessons
            .filter((l) => l.section.course.name === selectedCourse)
            .map((l) => [l.section.code, { code: l.section.code, name: l.section.name }])
        ).values()
      )
    : [];

  // Derive lessons for selected section
  const filteredLessons = selectedSection
    ? lessons.filter(
        (l) =>
          l.section.course.name === selectedCourse &&
          l.section.code === selectedSection
      )
    : [];

  function handleCourseChange(value: string) {
    setSelectedCourse(value);
    setSelectedSection("");
    setSelectedLessonId("");
  }

  function handleSectionChange(value: string) {
    setSelectedSection(value);
    setSelectedLessonId("");
  }

  const showLessonFields = mode === "edit" && Boolean(defaultValues?.lessonId);
  const showDetailFields = mode === "edit" && Boolean(
    defaultValues?.understandingLevel ||
    defaultValues?.participationLevel ||
    defaultValues?.careLevel ||
    defaultValues?.notes ||
    defaultValues?.nextPlan
  );

  return (
    <form action={formAction} className="space-y-4">
      {mode === "edit" && defaultValues?.id && (
        <input type="hidden" name="id" value={defaultValues.id} />
      )}

      {/* Learner */}
      <div className="space-y-1">
        <Label htmlFor="learnerId">교육생 *</Label>
        <select
          id="learnerId"
          name="learnerId"
          defaultValue={defaultValues?.learnerId ?? ""}
          className={selectClassName}
        >
          <option value="" disabled>교육생 선택</option>
          {learners.map((l) => (
            <option key={l.id} value={l.id}>
              {l.name}
            </option>
          ))}
        </select>
        <FieldError errors={state.errors.learnerId} />
      </div>

      {/* Week date */}
      <div className="space-y-1">
        <Label htmlFor="weekDate">주차 날짜 *</Label>
        <Input id="weekDate" name="weekDate" type="date" defaultValue={defaultValues?.weekDate} />
        <FieldError errors={state.errors.weekDate} />
      </div>

      {/* Attendance */}
      <div className="space-y-1">
        <Label htmlFor="attended">출석 여부 *</Label>
        <select
          id="attended"
          name="attended"
          defaultValue={defaultValues?.attended ?? ""}
          className={selectClassName}
        >
          <option value="" disabled>선택</option>
          <option value="true">출석</option>
          <option value="false">결석</option>
        </select>
        <FieldError errors={state.errors.attended} />
      </div>

      {/* Curriculum lesson selection — collapsible */}
      <details className="rounded-lg bg-secondary p-3 group" open={showLessonFields}>
        <summary className="text-sm font-medium cursor-pointer select-none flex items-center justify-between">
          커리큘럼 레슨 선택 (선택사항)
          <span className="text-xs text-muted-foreground group-open:hidden">펼치기</span>
        </summary>
        <div className="space-y-3 mt-3">

        {/* Course */}
        <div className="space-y-1">
          <Label htmlFor="courseSelect">과정</Label>
          <select
            id="courseSelect"
            value={selectedCourse}
            onChange={(event) => handleCourseChange(event.target.value)}
            className={selectClassName}
          >
            <option value="">과정 선택</option>
            {courses.map((c) => (
              <option key={c.name} value={c.name}>
                [{c.level}] {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Section */}
        {sections.length > 0 && (
          <div className="space-y-1">
            <Label htmlFor="sectionSelect">단원</Label>
            <select
              id="sectionSelect"
              value={selectedSection}
              onChange={(event) => handleSectionChange(event.target.value)}
              className={selectClassName}
            >
              <option value="">단원 선택</option>
              {sections.map((s) => (
                <option key={s.code} value={s.code}>
                  {s.code}. {s.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Lesson */}
        {filteredLessons.length > 0 && (
          <div className="space-y-1">
            <Label htmlFor="lessonId">레슨</Label>
            <select
              id="lessonId"
              name="lessonId"
              value={selectedLessonId}
              onChange={(event) => setSelectedLessonId(event.target.value)}
              className={selectClassName}
            >
              <option value="">레슨 선택</option>
              {filteredLessons.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.code}. {l.name}
                </option>
              ))}
            </select>
          </div>
        )}

        <FieldError errors={state.errors.lessonId} />
        </div>
      </details>

      {/* Study content */}
      <div className="space-y-1">
        <Label htmlFor="content">공부 내용 *</Label>
        <Textarea
          id="content"
          name="content"
          rows={4}
          placeholder="이번 주 성경공부 본문, 주제, 나눈 내용 등"
          defaultValue={defaultValues?.content}
        />
        <FieldError errors={state.errors.content} />
      </div>

      {/* Progress status */}
      <div className="space-y-1">
        <Label htmlFor="progressStatus">진행 상태</Label>
        <select
          id="progressStatus"
          name="progressStatus"
          defaultValue={defaultValues?.progressStatus ?? ""}
          className={selectClassName}
        >
          <option value="">선택 안 함</option>
          <option value="진행중">진행중</option>
          <option value="완료">완료</option>
          <option value="중단">중단</option>
          <option value="보류">보류</option>
        </select>
        <FieldError errors={state.errors.progressStatus} />
      </div>

      {/* Assessment levels — collapsible */}
      <details className="rounded-lg bg-secondary p-3 group" open={showDetailFields}>
        <summary className="text-sm font-medium cursor-pointer select-none flex items-center justify-between">
          평가 및 상세 (선택사항)
          <span className="text-xs text-muted-foreground group-open:hidden">펼치기</span>
        </summary>
        <div className="space-y-3 mt-3">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <LevelSelect name="understandingLevel" label="이해도 (1~5점)" defaultValue={defaultValues?.understandingLevel} />
            <LevelSelect name="participationLevel" label="참여도 (1~5점)" defaultValue={defaultValues?.participationLevel} />
            <LevelSelect
              name="careLevel"
              label="후속 돌봄 필요도 (1~5점)"
              helperText="높을수록 연락, 면담, 기도 등 후속 돌봄이 더 필요합니다."
              defaultValue={defaultValues?.careLevel}
            />
          </div>

          {/* Leader's notes */}
          <div className="space-y-1">
            <Label htmlFor="notes">메모</Label>
            <Textarea
              id="notes"
              name="notes"
              rows={2}
              placeholder="기도 제목, 특이사항 등"
              defaultValue={defaultValues?.notes}
            />
            <FieldError errors={state.errors.notes} />
          </div>

          {/* Next session plan */}
          <div className="space-y-1">
            <Label htmlFor="nextPlan">다음 계획</Label>
            <Textarea
              id="nextPlan"
              name="nextPlan"
              rows={2}
              placeholder="다음 주 학습 계획, 과제 등"
              defaultValue={defaultValues?.nextPlan}
            />
            <FieldError errors={state.errors.nextPlan} />
          </div>
        </div>
      </details>

      {/* Top-level server error (e.g. duplicate week) */}
      {state.message && (
        <p className="text-sm text-destructive">{state.message}</p>
      )}

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending
          ? (mode === "edit" ? "수정 중..." : "제출 중...")
          : (mode === "edit" ? "수정" : "제출")}
      </Button>
    </form>
  );
}

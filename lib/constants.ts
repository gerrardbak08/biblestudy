// lib/constants.ts
// Centralized configuration constants

export const PAGE_SIZE = 20;

export const CHART_WEEKS = 8;

export const DEPT_REPORTS_LIMIT = 50;

export const PROGRESS_STATUS_OPTIONS = ["진행중", "완료", "중단", "보류"] as const;

export type ProgressStatus = (typeof PROGRESS_STATUS_OPTIONS)[number];

export const SIGNUP_DEPARTMENT_OPTIONS = ["1장년", "2장년", "청년부", "중고등부"] as const;

export const LEARNER_INSTITUTION_OPTIONS = [
  "1장년",
  "2장년",
  "청년부",
  "중고등부",
  "외부or기타",
] as const;

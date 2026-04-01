// types/form.ts
// Shared type for Server Action return values used with useActionState

export type FormState = {
  // Field-level errors keyed by field name — from Zod's flatten().fieldErrors
  errors: Record<string, string[] | undefined>;
  // Optional top-level message (e.g., "이미 사용 중인 이메일입니다.")
  message?: string;
};

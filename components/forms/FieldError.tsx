// components/forms/FieldError.tsx
// Shared form field error display with accessibility support

interface FieldErrorProps {
  errors?: string[];
}

export function FieldError({ errors }: FieldErrorProps) {
  if (!errors?.length) return null;
  return (
    <p className="text-xs text-destructive mt-1 flex items-center gap-1" role="alert">
      <span aria-hidden="true">!</span> {errors[0]}
    </p>
  );
}

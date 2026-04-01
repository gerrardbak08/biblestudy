// components/ui/DetailRow.tsx
// Key-value display row for detail pages

interface DetailRowProps {
  label: string;
  children: React.ReactNode;
  border?: boolean;
}

export function DetailRow({ label, children, border = true }: DetailRowProps) {
  return (
    <div className={`flex justify-between py-1 ${border ? "border-b" : ""}`}>
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-medium">{children}</span>
    </div>
  );
}

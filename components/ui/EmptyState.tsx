// components/ui/EmptyState.tsx
// Reusable empty state with icon, message, and optional CTA

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  Users,
  FileText,
  ClipboardList,
  type LucideIcon,
} from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  learners: Users,
  reports: FileText,
  leaders: ClipboardList,
  default: BookOpen,
};

interface EmptyStateProps {
  icon?: keyof typeof iconMap;
  title: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
}

export function EmptyState({
  icon = "default",
  title,
  description,
  actionLabel,
  actionHref,
}: EmptyStateProps) {
  const Icon = iconMap[icon] ?? iconMap.default;

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="rounded-full bg-muted p-4 mb-4">
        <Icon className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="text-base font-medium mb-1">{title}</h3>
      {description && (
        <p className="text-sm text-muted-foreground max-w-xs mb-4">
          {description}
        </p>
      )}
      {actionLabel && actionHref && (
        <Link href={actionHref}>
          <Button size="sm">{actionLabel}</Button>
        </Link>
      )}
    </div>
  );
}

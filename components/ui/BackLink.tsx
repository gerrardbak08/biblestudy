// components/ui/BackLink.tsx
// Back navigation link with consistent styling

import Link from "next/link";

interface BackLinkProps {
  href: string;
  label: string;
}

export function BackLink({ href, label }: BackLinkProps) {
  return (
    <Link
      href={href}
      className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1"
    >
      &larr; {label}
    </Link>
  );
}

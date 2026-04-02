// components/layout/Header.tsx
// Contextual header — breadcrumb-style title + subtitle + logout

"use client";

import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export function Header({ title, subtitle }: HeaderProps) {
  return (
    <header
      className="h-14 border-b border-border/50 bg-card flex items-center justify-between px-5 md:px-8 shrink-0"
      role="banner"
    >
      <div className="flex items-center gap-2 min-w-0">
        <h2 className="font-semibold text-base tracking-tight truncate">{title}</h2>
        {subtitle && (
          <>
            <span className="text-muted-foreground/40" aria-hidden="true">/</span>
            <span className="text-sm text-muted-foreground truncate">{subtitle}</span>
          </>
        )}
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => signOut({ callbackUrl: "/login" })}
        aria-label="로그아웃"
        className="text-muted-foreground hover:text-foreground h-8 px-2.5 text-xs gap-1.5 shrink-0"
      >
        <LogOut className="h-3.5 w-3.5" />
        <span className="hidden sm:inline">로그아웃</span>
      </Button>
    </header>
  );
}

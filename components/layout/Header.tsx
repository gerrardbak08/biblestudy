// components/layout/Header.tsx
// Clean minimal header — page title + sign out

"use client";

import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

interface HeaderProps {
  title: string;
}

export function Header({ title }: HeaderProps) {
  return (
    <header className="h-12 border-b bg-background flex items-center justify-between px-4 md:px-6 shrink-0" role="banner">
      <h2 className="font-semibold text-sm">{title}</h2>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => signOut({ callbackUrl: "/login" })}
        aria-label="로그아웃"
        className="text-muted-foreground hover:text-foreground h-8 px-2 text-xs gap-1.5"
      >
        <LogOut className="h-3.5 w-3.5" />
        로그아웃
      </Button>
    </header>
  );
}

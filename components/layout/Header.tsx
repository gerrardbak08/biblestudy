// components/layout/Header.tsx
// Top header bar — displays current page title and a sign-out button

"use client";

import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  title: string;
}

export function Header({ title }: HeaderProps) {
  return (
    <header className="h-14 border-b bg-card flex items-center justify-between px-4 md:px-6 shrink-0" role="banner">
      <h2 className="font-semibold text-sm md:text-base">{title}</h2>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => signOut({ callbackUrl: "/login" })}
        aria-label="로그아웃"
        className="min-h-[44px] min-w-[44px]"
      >
        로그아웃
      </Button>
    </header>
  );
}

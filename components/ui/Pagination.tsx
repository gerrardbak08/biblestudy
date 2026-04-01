// components/ui/Pagination.tsx
// Simple page-based pagination component

"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  basePath: string;
}

export function Pagination({ currentPage, totalPages, basePath }: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  const visiblePages = pages.filter(
    (p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1
  );

  return (
    <nav className="flex items-center justify-center gap-1.5 pt-4" aria-label="페이지 탐색">
      {currentPage > 1 && (
        <Link href={`${basePath}?page=${currentPage - 1}`} aria-label="이전 페이지">
          <Button variant="outline" size="sm" className="min-h-[44px] min-w-[44px]">이전</Button>
        </Link>
      )}

      {visiblePages.map((page, i) => {
        const prev = visiblePages[i - 1];
        const showEllipsis = prev && page - prev > 1;

        return (
          <span key={page} className="flex items-center gap-1.5">
            {showEllipsis && <span className="px-1 text-muted-foreground" aria-hidden="true">...</span>}
            <Link
              href={`${basePath}?page=${page}`}
              aria-label={`${page}페이지`}
              aria-current={page === currentPage ? "page" : undefined}
            >
              <Button
                variant={page === currentPage ? "default" : "outline"}
                size="sm"
                className="min-h-[44px] min-w-[44px]"
              >
                {page}
              </Button>
            </Link>
          </span>
        );
      })}

      {currentPage < totalPages && (
        <Link href={`${basePath}?page=${currentPage + 1}`} aria-label="다음 페이지">
          <Button variant="outline" size="sm" className="min-h-[44px] min-w-[44px]">다음</Button>
        </Link>
      )}
    </nav>
  );
}

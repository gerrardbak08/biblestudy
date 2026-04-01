// components/ui/CsvExportButton.tsx
// Client-side CSV export button — converts data array to CSV and triggers download

"use client";

import { Button } from "@/components/ui/button";

interface CsvExportButtonProps {
  data: Record<string, string | number | boolean | null>[];
  headers: { key: string; label: string }[];
  filename: string;
}

export function CsvExportButton({ data, headers, filename }: CsvExportButtonProps) {
  const handleExport = () => {
    const headerRow = headers.map((h) => h.label).join(",");
    const rows = data.map((row) =>
      headers
        .map((h) => {
          const val = row[h.key];
          if (val === null || val === undefined) return "";
          const str = String(val);
          return str.includes(",") || str.includes('"') || str.includes("\n")
            ? `"${str.replace(/"/g, '""')}"`
            : str;
        })
        .join(",")
    );

    const bom = "\uFEFF";
    const csv = bom + [headerRow, ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${filename}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Button variant="outline" size="sm" onClick={handleExport}>
      CSV 내보내기
    </Button>
  );
}

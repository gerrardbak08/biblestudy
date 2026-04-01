// app/(dashboard)/layout.tsx
// Shared dashboard layout — sidebar + main content shell for both admin and leader

import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session) redirect("/login");

  return (
    <AppShell role={session.user.role} userName={session.user.name}>
      {children}
    </AppShell>
  );
}

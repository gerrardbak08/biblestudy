// app/page.tsx
// Root page — redirects authenticated users to their role dashboard

import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function RootPage() {
  const session = await auth();

  if (!session) redirect("/login");
  if (session.user.role === "ADMIN") redirect("/admin");
  if (session.user.role === "DEPT_HEAD") redirect("/dept");
  redirect("/leader");
}

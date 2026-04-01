// app/api/auth/[...nextauth]/route.ts
// NextAuth catch-all route handler — delegates all auth HTTP requests to NextAuth

import { handlers } from "@/lib/auth";

export const { GET, POST } = handlers;

// types/index.ts
// Shared type definitions used across the platform

import type { Role } from "@prisma/client";

// Extends NextAuth session to include user role, id, and departmentId
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      role: Role;
      departmentId: string | null;
    };
  }

  interface User {
    id: string;
    role: Role;
    departmentId: string | null;
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    id: string;
    role: Role;
    departmentId: string | null;
  }
}

export type { Role };

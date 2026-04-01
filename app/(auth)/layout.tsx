// app/(auth)/layout.tsx
// Layout for unauthenticated pages (login) — vertically + horizontally centered

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 dark:from-background dark:via-background dark:to-background">
      {children}
    </div>
  );
}

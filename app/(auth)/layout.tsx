// app/(auth)/layout.tsx
// Auth layout — centered on subtle gray canvas with pattern

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      {/* Subtle radial gradient for depth */}
      <div className="fixed inset-0 bg-gradient-to-br from-primary/[0.02] via-transparent to-primary/[0.02] pointer-events-none" />
      <div className="relative">
        {children}
      </div>
    </div>
  );
}

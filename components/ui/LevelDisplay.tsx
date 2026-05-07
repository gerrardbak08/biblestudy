// components/ui/LevelDisplay.tsx
// Renders a 1-5 score as filled/empty circles, e.g. "●●●○○ (3점/5점)"

interface LevelDisplayProps {
  level: number | null;
  label: string;
}

export function LevelDisplay({ level, label }: LevelDisplayProps) {
  return (
    <div className="flex justify-between py-1 border-b last:border-0">
      <span className="text-sm text-muted-foreground">{label}</span>
      {level ? (
        <span className="text-sm font-medium">
          {"●".repeat(level)}{"○".repeat(5 - level)}{" "}
          <span className="text-muted-foreground">({level}점/5점)</span>
        </span>
      ) : (
        <span className="text-sm text-muted-foreground">미입력</span>
      )}
    </div>
  );
}

// src/features/dashboard/components/Stars.tsx
export function Stars({ rating }: { rating: number | undefined }) {
  if (!rating) {
    return (
      <span className="text-sm italic text-muted-foreground">
        Not assessed
      </span>
    );
  }

  return (
    <span className="font-mono text-lg tracking-wider text-amber-500">
      {"★".repeat(rating)}
      {"☆".repeat(5 - rating)}
    </span>
  );
}

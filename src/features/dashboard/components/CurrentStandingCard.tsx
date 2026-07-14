// src/features/dashboard/components/CurrentStandingCard.tsx
import Card from "@/components/ui/Card";
import Text from "@/components/ui/Text";
import { Stars } from "./Stars";

const TEMPLATE_LABELS: Record<string, string> = {
  hld: "High-Level Design",
  lld: "Low-Level Design",
  dsa: "Data Structures & Algorithms",
};

type Props = {
  hasData: boolean;
  overallReadiness: number | null;
  categoryRatings: Record<string, number>;
};

export default function CurrentStandingCard({
  hasData,
  overallReadiness,
  categoryRatings,
}: Props) {
  return (
    <Card className="p-6 space-y-6">
      <div>
        <div className="mb-2 flex items-baseline justify-between">
          <Text variant="small" className="font-medium">
            Interview Readiness
          </Text>
          <span className="font-mono text-2xl font-bold text-foreground">
            {hasData && overallReadiness !== null
              ? `${overallReadiness}%`
              : "—"}
          </span>
        </div>

        {hasData && overallReadiness !== null ? (
          <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary transition-all duration-1000"
              style={{ width: `${overallReadiness}%` }}
            />
          </div>
        ) : (
          <Text variant="small" className="italic">
            Not enough data yet. Complete an interview to calculate
            readiness.
          </Text>
        )}
      </div>

      <div className="space-y-3 border-t border-border pt-4">
        {Object.entries(TEMPLATE_LABELS).map(([slug, label]) => (
          <div key={slug} className="flex items-center justify-between">
            <span className="font-mono text-sm text-muted-foreground">
              {label}
            </span>
            <Stars rating={categoryRatings[slug]} />
          </div>
        ))}
      </div>
    </Card>
  );
}

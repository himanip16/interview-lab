// src/features/dashboard/components/LiveFeedbackCard.tsx
import Card from "@/shared/ui/Card";
import Text from "@/shared/ui/Text";
import type { SkillGraph } from "@/features/interview/mastery/SkillGraphService";

type Props = {
  hasData: boolean;
  skillGraph: SkillGraph;
};

export default function LiveFeedbackCard({ hasData, skillGraph }: Props) {
  const strengthNames = skillGraph.strengths.slice(0, 3).map((s) => s.name);
  const weaknessNames = skillGraph.weaknesses.slice(0, 3).map((w) => w.name);

  return (
    <Card className="p-6 flex h-[230px] flex-col justify-between">
      {hasData && (strengthNames.length > 0 || weaknessNames.length > 0) ? (
        <div className="grid h-full grid-cols-2 gap-4">
          <div className="space-y-3 overflow-y-auto border-r border-border pr-2">
            <span className="block text-xs font-semibold uppercase tracking-wide text-green-500">
              Recently Improved
            </span>
            <ul className="space-y-1.5">
              {strengthNames.length > 0 ? (
                strengthNames.map((name, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-1 text-xs leading-snug text-foreground"
                  >
                    <span className="mt-0.5 text-green-500">✓</span>
                    {name}
                  </li>
                ))
              ) : (
                <li className="text-xs italic text-muted-foreground">
                  None yet
                </li>
              )}
            </ul>
          </div>

          <div className="space-y-3 overflow-y-auto pl-2">
            <span className="block text-xs font-semibold uppercase tracking-wide text-amber-500">
              Needs Attention
            </span>
            <ul className="space-y-1.5">
              {weaknessNames.length > 0 ? (
                weaknessNames.map((name, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-1 text-xs leading-snug text-foreground"
                  >
                    <span className="mt-0.5 text-amber-500">•</span>
                    {name}
                  </li>
                ))
              ) : (
                <li className="text-xs italic text-muted-foreground">
                  None yet
                </li>
              )}
            </ul>
          </div>
        </div>
      ) : (
        <div className="flex h-full flex-col items-center justify-center p-4 text-center">
          <Text variant="small" className="italic">
            Practice more problems to surface strengths and growth
            areas.
          </Text>
        </div>
      )}
    </Card>
  );
}

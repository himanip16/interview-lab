// src/features/dashboard/components/SkillGraphView.tsx

import type { SkillGraph } from "@/features/interview/application/services/mastery/SkillGraphService";

function scoreColor(score: number | null): string {
  if (score === null) return "bg-muted";
  if (score >= 0.7) return "bg-success";
  if (score >= 0.4) return "bg-warning";
  return "bg-error";
}

type Props = {
  skillGraph: SkillGraph;
};

export default function SkillGraphView({ skillGraph }: Props) {
  const categories = Object.entries(skillGraph.categories);

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Skill Graph</h2>

        {skillGraph.overallMastery !== null && (
          <span className="text-sm text-muted-foreground">
            Overall mastery: {Math.round(skillGraph.overallMastery * 100)}%
          </span>
        )}
      </div>

      <div className="mt-8 space-y-8">
        {categories.map(([category, concepts]) => (
          <div key={category}>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              {category.replace(/_/g, " ")}
            </h3>

            <div className="space-y-3">
              {concepts.map((concept) => (
                <div key={concept.conceptId}>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span className="text-foreground">{concept.name}</span>

                    <span className="text-muted-foreground">
                      {concept.score === null
                        ? "Not yet assessed"
                        : `${Math.round(concept.score * 100)}%`}
                    </span>
                  </div>

                  <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className={`h-full ${scoreColor(concept.score)} transition-all`}
                      style={{
                        width: `${
                          concept.score !== null
                            ? Math.round(concept.score * 100)
                            : 8
                        }%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {(skillGraph.strengths.length > 0 || skillGraph.weaknesses.length > 0) && (
        <div className="mt-8 grid gap-6 border-t border-border pt-6 sm:grid-cols-2">
          <div>
            <h3 className="mb-2 text-sm font-semibold text-success">
              Strengths
            </h3>

            <ul className="space-y-1 text-sm text-muted-foreground">
              {skillGraph.strengths.map((s) => (
                <li key={s.conceptId}>{s.name}</li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-2 text-sm font-semibold text-error">
              Focus Areas
            </h3>

            <ul className="space-y-1 text-sm text-muted-foreground">
              {skillGraph.weaknesses.map((w) => (
                <li key={w.conceptId}>{w.name}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
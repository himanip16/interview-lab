import type { SkillGraph } from "@/modules/interview/services/mastery/SkillGraphService";

function scoreColor(score: number | null): string {
  if (score === null) return "bg-zinc-800";
  if (score >= 0.7) return "bg-green-500";
  if (score >= 0.4) return "bg-yellow-500";
  return "bg-red-500";
}

type Props = {
  skillGraph: SkillGraph;
};

export default function SkillGraphView({ skillGraph }: Props) {
  const categories = Object.entries(skillGraph.categories);

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Skill Graph</h2>

        {skillGraph.overallMastery !== null && (
          <span className="text-sm text-zinc-400">
            Overall mastery: {Math.round(skillGraph.overallMastery * 100)}%
          </span>
        )}
      </div>

      <div className="mt-8 space-y-8">
        {categories.map(([category, concepts]) => (
          <div key={category}>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-zinc-500">
              {category.replace(/_/g, " ")}
            </h3>

            <div className="space-y-3">
              {concepts.map((concept) => (
                <div key={concept.conceptId}>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span className="text-zinc-300">{concept.name}</span>

                    <span className="text-zinc-500">
                      {concept.score === null
                        ? "Not yet assessed"
                        : `${Math.round(concept.score * 100)}%`}
                    </span>
                  </div>

                  <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-800">
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
        <div className="mt-8 grid gap-6 border-t border-zinc-800 pt-6 sm:grid-cols-2">
          <div>
            <h3 className="mb-2 text-sm font-semibold text-green-500">
              Strengths
            </h3>

            <ul className="space-y-1 text-sm text-zinc-400">
              {skillGraph.strengths.map((s) => (
                <li key={s.conceptId}>{s.name}</li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-2 text-sm font-semibold text-red-500">
              Focus Areas
            </h3>

            <ul className="space-y-1 text-sm text-zinc-400">
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
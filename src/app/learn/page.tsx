"use client";

import { useScenarios } from "@/src/features/learning/hooks/useScenario";
import { ScenarioListItem } from "@/src/features/learning/types/learning";
import Link from "next/link";

export default function LearnPage() {
  const { scenarios, loading, error } = useScenarios();

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading scenarios...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center py-12">
          <p className="text-destructive">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Learning Scenarios</h1>
        <p className="text-muted-foreground">
          Explore real interview conversations and learn from expert responses.
        </p>
      </div>

      {scenarios.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No scenarios available yet.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {scenarios.map((scenario: ScenarioListItem) => (
            <Link
              key={scenario.id}
              href={`/learn/${scenario.slug}`}
              className="block p-6 border border-border rounded-lg hover:border-primary transition-colors"
            >
              <h2 className="text-xl font-semibold mb-2">{scenario.title}</h2>
              {scenario.description && (
                <p className="text-muted-foreground mb-4">{scenario.description}</p>
              )}
              <div className="text-sm text-muted-foreground">
                {scenario._count.segments} segment{scenario._count.segments !== 1 ? "s" : ""}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

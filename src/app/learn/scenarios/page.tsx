"use client";

import Link from "next/link";
import { useScenarios } from "@/features/learning/hooks/useScenario";
import { ROUTES } from "@/shared/constants/routes";

export default function ScenariosListPage() {
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
          <Link href={ROUTES.LEARN} className="text-primary hover:underline mt-4 inline-block">
            Back to Learn
          </Link>
        </div>
      </div>
    );
  }

  return (
    <main className="mx-auto max-w-4xl px-6 py-12 text-foreground">
      <h1 className="text-3xl font-bold tracking-tight mb-2">Learning Scenarios</h1>
      <p className="text-muted-foreground mb-8">
        Guided scenarios to master distributed systems concepts step by step.
      </p>

      {scenarios.length === 0 ? (
        <p className="text-muted-foreground">No scenarios available yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {scenarios.map((scenario) => (
            <Link
              key={scenario.id}
              href={`/learn/scenarios/${scenario.slug}`}
              className="rounded-lg border border-border bg-card p-5 transition hover:border-foreground/40"
            >
              <h3 className="font-semibold text-foreground mb-1">{scenario.title}</h3>
              {scenario.description && (
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {scenario.description}
                </p>
              )}
              <span className="mt-3 block text-xs font-mono text-muted-foreground">
                {scenario._count.segments} segment{scenario._count.segments !== 1 ? "s" : ""}
              </span>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
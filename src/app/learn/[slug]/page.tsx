"use client";

import { use } from "react";
import { useScenario } from "@/src/features/learning/hooks/useScenario";
import { LearningScenarioReader } from "@/src/features/learning/components/LearningScenarioReader";
import Link from "next/link";

export default function ScenarioPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const { scenario, loading, error } = useScenario(slug);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading scenario...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center py-12">
          <p className="text-destructive">{error}</p>
          <Link href="/learn" className="text-primary hover:underline mt-4 inline-block">
            Back to Scenarios
          </Link>
        </div>
      </div>
    );
  }

  if (!scenario) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center py-12">
          <p className="text-muted-foreground">Scenario not found.</p>
          <Link href="/learn" className="text-primary hover:underline mt-4 inline-block">
            Back to Scenarios
          </Link>
        </div>
      </div>
    );
  }

  return <LearningScenarioReader scenario={scenario} />;
}

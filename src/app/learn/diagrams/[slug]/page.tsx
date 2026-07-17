"use client";

import { DeepDiveHero } from "@/features/learning/components/DeepDiveHero";
import {
  getDeepDiveSystem,
  getPrevSystem,
  getNextSystem,
  DEEP_DIVE_SYSTEMS,
} from "@/features/learning/data/deepDives";
import { useRouter, useParams } from "next/navigation";

// Lazy import diagrams
const DIAGRAM_MAP: Record<string, React.ComponentType> = {
  cassandra: () => require("@/features/learning/components/diagrams/CassandraDiagram").CassandraDiagram(),
  redis: () => require("@/features/learning/components/diagrams/RedisDiagram").RedisDiagram(),
  kafka: () => require("@/features/learning/components/diagrams/KafkaDiagram").KafkaDiagram(),
};

export default function DeepDivePage() {
  const router = useRouter();
  const params = useParams();
  const slug = params.slug as string;

  const system = getDeepDiveSystem(slug);
  const prevSystem = getPrevSystem(slug);
  const nextSystem = getNextSystem(slug);

  if (!system) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Deep Dive Not Found</h1>
          <p className="text-lg mb-6 text-gray-600">
            This system doesn't have a deep dive yet.
          </p>
          <button
            onClick={() => router.push("/learn/diagrams")}
            className="px-6 py-2 bg-blue-500 text-white rounded"
          >
            Back to Diagrams
          </button>
        </div>
      </div>
    );
  }

  const DiagramComponent = DIAGRAM_MAP[slug];

  return (
    <DeepDiveHero
      systemName={system.name}
      category={system.category}
      eyebrow={system.eyebrow}
      description={system.description}
      tags={system.tags}
      credit={system.credit}
      creditOrg={system.creditOrg}
      diagramSvg={DiagramComponent ? <DiagramComponent /> : <div />}
      prevSystem={prevSystem ? { name: prevSystem.name, slug: prevSystem.slug } : undefined}
      nextSystem={nextSystem ? { name: nextSystem.name, slug: nextSystem.slug } : undefined}
      onReadMore={() => {
        if (system.scenarioSlug) {
          router.push(`/learn/scenarios/${system.scenarioSlug}`);
        }
      }}
      onDocuments={() => window.open(system.docsUrl, "_blank")}
    />
  );
}

// Generate static pages for all systems
export function generateStaticParams() {
  return DEEP_DIVE_SYSTEMS.map((system) => ({
    slug: system.slug,
  }));
}
// src/app/learn/diagrams/[slug]/page.tsx
// FIXED: Consistent slug parameter throughout

"use client";

import { DeepDiveHero } from "@/features/learning/components/DeepDiveHero";
import { CassandraDiagram } from "@/features/learning/components/diagrams/CassandraDiagram";
import { RedisDiagram } from "@/features/learning/components/diagrams/RedisDiagram";
import { KafkaDiagram } from "@/features/learning/components/diagrams/KafkaDiagram";
import {
  getDeepDiveSystem,
  getPrevSystem,
  getNextSystem,
  DEEP_DIVE_SYSTEMS,
} from "@/features/learning/data/deepDives";
import { useRouter } from "next/navigation";

// ✅ FIX: Inline diagram map (no require)
const DIAGRAM_COMPONENTS: Record<string, React.ComponentType> = {
  cassandra: CassandraDiagram,
  redis: RedisDiagram,
  kafka: KafkaDiagram,
};

interface PageProps {
  params: {
    slug: string;  // ✅ Must match folder name [slug]
  };
}

export default function DeepDivePage({ params }: PageProps) {
  const router = useRouter();
  const { slug } = params;

  const system = getDeepDiveSystem(slug);
  const prevSystem = getPrevSystem(slug);
  const nextSystem = getNextSystem(slug);

  if (!system) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--paper)]">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4 text-[var(--ink)]">
            Deep Dive Not Found
          </h1>
          <p className="text-lg mb-6 text-[var(--ink-soft)]">
            The system "{slug}" doesn't have a deep dive yet.
          </p>
          <button
            onClick={() => router.push("/learn/diagrams")}
            className="px-6 py-2 bg-[var(--ink)] text-white rounded-full font-semibold hover:bg-[var(--ink-soft)]"
          >
            Back to Diagrams
          </button>
        </div>
      </div>
    );
  }

  // ✅ Get diagram component (undefined is ok, component checks)
  const DiagramComponent = DIAGRAM_COMPONENTS[slug];

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
      prevSystem={
        prevSystem
          ? { name: prevSystem.name, slug: prevSystem.slug }
          : undefined
      }
      nextSystem={
        nextSystem
          ? { name: nextSystem.name, slug: nextSystem.slug }
          : undefined
      }
      onReadMore={() => {
        if (system.scenarioSlug) {
          router.push(`/learn/scenarios/${system.scenarioSlug}`);
        }
      }}
      onDocuments={() => window.open(system.docsUrl, "_blank")}
    />
  );
}

// ✅ Generate static params for all systems (optional but recommended)
export async function generateStaticParams() {
  return DEEP_DIVE_SYSTEMS.map((system) => ({
    slug: system.slug,
  }));
}

// ✅ Metadata for each page
export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const system = getDeepDiveSystem(slug);
  
  if (!system) {
    return {
      title: "Deep Dive Not Found",
    };
  }

  return {
    title: `${system.name} - Deep Dive | Learn`,
    description: system.description[0]?.replace(/<b>|<\/b>/g, ""),
  };
}
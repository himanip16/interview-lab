// src/app/learn/diagrams/[slug]/page.tsx

import Link from "next/link";

import { DeepDiveHero } from "@/features/deep-dive/components/DeepDiveHero";
import { CassandraDiagram } from "@/features/learning/components/diagrams/CassandraDiagram";
import { RedisDiagram } from "@/features/learning/components/diagrams/Redis";
import { KafkaDiagram } from "@/features/learning/components/diagrams/Kafka";

import {
  getDeepDiveSystem,
  getPrevSystem,
  getNextSystem,
  DEEP_DIVE_SYSTEMS,
} from "@/features/learning/data/deepDives";

const DIAGRAM_COMPONENTS: Record<string, React.ComponentType> = {
  cassandra: CassandraDiagram,
  redis: RedisDiagram,
  kafka: KafkaDiagram,
};

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function DeepDivePage({ params }: PageProps) {
  const { slug } = await params;

  const normalizedSlug = slug.toLowerCase();

  const system = getDeepDiveSystem(normalizedSlug);

  if (!system) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--paper)]">
        <div className="text-center">
          <h1 className="mb-4 text-3xl font-bold text-[var(--ink)]">
            Deep Dive Not Found
          </h1>

          <p className="mb-6 text-lg text-[var(--ink-soft)]">
            The system "{slug}" doesn't have a deep dive yet.
          </p>

          <Link
            href="/learn/diagrams"
            className="rounded-full bg-[var(--ink)] px-6 py-2 font-semibold text-white hover:bg-[var(--ink-soft)]"
          >
            Back to Diagrams
          </Link>
        </div>
      </div>
    );
  }

  const DiagramComponent = DIAGRAM_COMPONENTS[normalizedSlug];

  return (
    <DeepDiveHero
      systemName={system.name}
      systemSlug={system.slug}
      category={system.category}
      eyebrow={system.eyebrow}
      description={system.description}
      tags={system.tags}
      creditOrg={system.creditOrg}
      diagramSvg={DiagramComponent ? <DiagramComponent /> : null}
      docsUrl={system.docsUrl}
    />
  );
}

export async function generateStaticParams() {
  return DEEP_DIVE_SYSTEMS.map((system) => ({
    slug: system.slug,
  }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;

  const system = getDeepDiveSystem(slug.toLowerCase());

  if (!system) {
    return {
      title: "Deep Dive Not Found",
    };
  }

  return {
    title: `${system.name} - Deep Dive | Learn`,
    description:
      typeof system.description[0] === "string"
        ? system.description[0].replace(/<[^>]+>/g, "")
        : `${system.name} deep dive`,
  };
}
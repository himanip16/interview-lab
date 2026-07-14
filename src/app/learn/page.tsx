// src/app/learn/page.tsx
"use client";

import { useScenarios } from "@/src/features/learning/hooks/useScenario";
import Link from "next/link";
import Card from "@/src/components/ui/Card";
import Heading from "@/src/components/ui/Heading";
import Text from "@/src/components/ui/Text";

export default function LearnPage() {
  const { scenarios, loading } = useScenarios();

  const diagrams = [
    { slug: "uber", title: "Uber", desc: "Real-time matching & geospatial indexing" },
    { slug: "twitter", title: "Twitter", desc: "Timeline fanout & eventual consistency" },
    { slug: "netflix", title: "Netflix", desc: "Video streaming & CDN distribution" },
    { slug: "whatsapp", title: "WhatsApp", desc: "E2E encryption & WebSocket scaling" },
  ];

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-12">
      <header className="border-b border-border pb-8">
        <Heading level="h1">Learning Center</Heading>
        <Text variant="muted" className="mt-2">
          Master system design through interactive blueprints and guided scenarios.
        </Text>
      </header>

      {/* Section 1: Architecture Blueprints */}
      <section>
        <div className="flex items-baseline justify-between mb-6">
          <Heading level="h2">Architecture Blueprints</Heading>
          <Link href="/learn/diagrams" className="text-sm text-primary hover:underline">View all diagrams →</Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {diagrams.map((d) => (
            <Link key={d.slug} href={`/learn/diagrams/${d.slug}`}>
              <Card className="hover:border-primary transition-colors h-full">
                <span className="text-[10px] font-mono text-primary uppercase font-bold">Interactive</span>
                <h3 className="font-bold mt-1">{d.title}</h3>
                <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{d.desc}</p>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Section 2: Guided Scenarios */}
      <section>
        <Heading level="h2" className="mb-6">Guided Scenarios</Heading>
        {loading ? (
          <Text variant="muted">Loading scenarios...</Text>
        ) : (
          <div className="grid gap-4">
            {scenarios.map((scenario) => (
              <Link key={scenario.id} href={`/learn/scenarios/${scenario.slug}`}>
                <Card className="flex items-center justify-between hover:border-primary transition-colors">
                  <div>
                    <h3 className="font-bold text-lg">{scenario.title}</h3>
                    <Text variant="small">{scenario.description}</Text>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-mono bg-muted px-2 py-1 rounded">
                      {scenario._count.segments} Steps
                    </span>
                    <div className="text-primary text-sm mt-2">Start Journey →</div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
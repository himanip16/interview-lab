"use client";

import Link from "next/link";
import Card from "@/src/components/ui/Card";
import Heading from "@/src/components/ui/Heading";
import Text from "@/src/components/ui/Text";

export default function SmartMentor() {
  return (
    <section className="py-16">
      <div className="mb-8">
        <Heading level="h2" className="mb-2">
          Smart Recommendation
        </Heading>
        <Text variant="muted">What should I practice next?</Text>
      </div>

      <Card rounded="2xl" padding="8">
        <div className="flex items-start justify-between mb-6">
          <div>
            <Heading level="h3" className="mb-2">
              Recommended Practice
            </Heading>
            <Text variant="small">
              Based on your skill graph
            </Text>
          </div>
          <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 text-xs font-mono rounded-full border border-emerald-500/20">
            Easy • 30 min
          </span>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          <span className="px-3 py-1 bg-muted text-foreground text-sm rounded-md">
            Base62 Encoding
          </span>
          <span className="px-3 py-1 bg-muted text-foreground text-sm rounded-md">
            Key Generation Service
          </span>
          <span className="px-3 py-1 bg-muted text-foreground text-sm rounded-md">
            Database Indexing
          </span>
        </div>

        <Link
          href="/interview/setup"
          className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity"
        >
          Start Practice
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </Link>
      </Card>
    </section>
  );
}

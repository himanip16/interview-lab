// src/app/learn/diagrams/page.tsx

"use client";

import Link from "next/link";
import { DEEP_DIVE_SYSTEMS } from "@/features/learning/data/deepDives";

export default function DiagramsPage() {
  const sorted = [...DEEP_DIVE_SYSTEMS].sort((a, b) => a.order - b.order);

  return (
    <main className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold tracking-tight mb-2">Deep Dives</h1>
      <p className="text-muted-foreground mb-8">
        Explore distributed systems and technologies in depth.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sorted.map((system) => (
          <Link
            key={system.slug}
            href={`/learn/diagrams/${system.slug}`}
            className="rounded-lg border border-border bg-card p-5 transition hover:border-foreground/40"
          >
            <h3 className="font-semibold text-foreground mb-1">
              {system.name}
            </h3>
            <p className="text-sm text-muted-foreground mb-3">
              {system.category}
            </p>
            <div className="flex gap-2 flex-wrap">
              {system.tags.slice(0, 2).map((tag) => (
                <span
                  key={tag}
                  className="text-xs font-mono text-muted-foreground"
                >
                  #{tag.toLowerCase().replace(/\s+/g, "-")}
                </span>
              ))}
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
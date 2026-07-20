// src/features/library/components/DiagramGallery.tsx
"use client";

import Link from "next/link";
import Heading from "@/shared/ui/Heading";
import Text from "@/shared/ui/Text";
import Card from "@/shared/ui/Card";

type Diagram = {
  href: string;
  difficulty: string;
  color: string;
  title: string;
  description: string;
};

const DIAGRAMS: Diagram[] = [
  {
    href: "/learn/diagrams",
    difficulty: "Medium HLD",
    color: "blue",
    title: "Design Dropbox",
    description: "Metadata sync, block-level storage, and S3-backed durability.",
  },
  {
    href: "/learn/diagrams/twitter",
    difficulty: "Hard HLD",
    color: "green",
    title: "Design Twitter/X",
    description: "Timeline generation, fanout writes, and eventual consistency.",
  },
  {
    href: "/learn/diagrams/netflix",
    difficulty: "Hard HLD",
    color: "purple",
    title: "Design Netflix",
    description: "Video streaming, CDN distribution, and personalized recommendations.",
  },
  {
    href: "/learn/diagrams/uber",
    difficulty: "Medium HLD",
    color: "orange",
    title: "Design Uber",
    description: "Real-time matching, geospatial indexing, and surge pricing.",
  },
  {
    href: "/learn/diagrams/instagram",
    difficulty: "Hard HLD",
    color: "red",
    title: "Design Instagram",
    description: "Photo upload, feed generation, and story expiration.",
  },
  {
    href: "/learn/diagrams/whatsapp",
    difficulty: "Medium HLD",
    color: "cyan",
    title: "Design WhatsApp",
    description: "Real-time messaging, message queues, and end-to-end encryption.",
  },
];

const COLOR_CLASSES: Record<string, string> = {
  blue: "bg-blue-500/10 text-blue-400",
  green: "bg-green-500/10 text-green-400",
  purple: "bg-purple-500/10 text-purple-400",
  orange: "bg-orange-500/10 text-orange-400",
  red: "bg-red-500/10 text-red-400",
  cyan: "bg-cyan-500/10 text-cyan-400",
};

export default function DiagramGallery() {
  return (
    <Card className="p-6">
      <Heading level="h4">System Design Blueprints</Heading>
      <Text variant="small" className="mt-2">
        Explore an interactive, clickable architecture diagram to see
        how each component's role, failure modes, and tradeoffs fit
        together.
      </Text>

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {DIAGRAMS.map((diagram) => (
          <Link
            key={diagram.href}
            href={diagram.href}
            className="rounded border border-border bg-muted p-4 text-left transition hover:border-foreground/40"
          >
            <span
              className={`inline-block rounded px-2 py-0.5 font-mono text-[9px] font-bold uppercase ${COLOR_CLASSES[diagram.color]}`}
            >
              {diagram.difficulty}
            </span>
            <h4 className="mt-2 text-xs font-bold text-foreground">
              {diagram.title}
            </h4>
            <p className="mt-1 line-clamp-1 text-[10px] text-muted-foreground">
              {diagram.description}
            </p>
          </Link>
        ))}
      </div>
    </Card>
  );
}

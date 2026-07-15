// src/features/library/components/TranscriptCard.tsx

"use client";

import { useRouter } from "next/navigation";

import Card from "@/components/ui/Card";
import { TranscriptEntry } from "@/content/transcripts/types";

type Props = {
  transcript: TranscriptEntry;
};

const CATEGORY_COLORS = {
  hld: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  lld: "bg-green-500/10 text-green-400 border-green-500/20",
  dsa: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  behavioural: "bg-orange-500/10 text-orange-400 border-orange-500/20",
} as const;

export default function TranscriptCard({ transcript }: Props) {
  const router = useRouter();

  const { summary } = transcript;

  return (
    <Card
      onClick={() => router.push(`/library/transcript/${summary.slug}`)}
      className="cursor-pointer p-5 transition-all hover:-translate-y-0.5 hover:border-foreground/30 hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-6">
        <div className="min-w-0 flex-1 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`rounded border px-2 py-1 font-mono text-[10px] uppercase tracking-wider ${
                CATEGORY_COLORS[summary.category]
              }`}
            >
              {summary.category}
            </span>

            <span className="rounded border border-border bg-muted px-2 py-1 font-mono text-[10px] uppercase">
              {summary.difficulty}
            </span>

            <span className="rounded border border-border bg-muted px-2 py-1 font-mono text-[10px]">
              {summary.duration} min
            </span>

            {summary.company && (
              <span className="rounded border border-border bg-muted px-2 py-1 font-mono text-[10px]">
                {summary.company}
              </span>
            )}
          </div>

          <div>
            <h3 className="text-lg font-semibold text-foreground">
              {summary.title}
            </h3>

            <p className="mt-2 text-sm text-muted-foreground">
              {summary.description}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {summary.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-muted px-3 py-1 text-xs"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="flex shrink-0 items-center">
          <span className="text-xl text-muted-foreground">→</span>
        </div>
      </div>
    </Card>
  );
}
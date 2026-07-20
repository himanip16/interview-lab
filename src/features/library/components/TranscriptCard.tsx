// src/features/library/components/TranscriptCard.tsx

"use client";

import { useRouter } from "next/navigation";

import Card from "@/shared/ui/Card";
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
      className="cursor-pointer p-6 transition-all hover:-translate-y-0.5 hover:border-foreground/30 hover:shadow-md"
    >
      <div className="flex flex-col h-full">
        {/* Meta row */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          {summary.company && (
            <span className="font-semibold text-sm text-foreground">
              {summary.company}
            </span>
          )}
          <span className="text-muted-foreground">•</span>
          <span className="rounded border border-border bg-muted px-2 py-1 font-mono text-[10px] uppercase">
            {summary.difficulty}
          </span>
          <span className="text-muted-foreground">•</span>
          <span className="rounded border border-border bg-muted px-2 py-1 font-mono text-[10px]">
            {summary.duration} min
          </span>
        </div>

        {/* Title */}
        <h3 className="text-xl font-semibold text-foreground mb-2">
          {summary.title}
        </h3>

        {/* Description */}
        <p className="text-sm text-muted-foreground mb-4 flex-1">
          {summary.description}
        </p>

        {/* Topics/Tags */}
        <div className="flex flex-wrap gap-2">
          {summary.tags.slice(0, 5).map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-muted/50 px-3 py-1 text-xs font-medium text-muted-foreground"
            >
              {tag}
            </span>
          ))}
          {summary.tags.length > 5 && (
            <span className="rounded-full bg-muted/50 px-3 py-1 text-xs font-medium text-muted-foreground">
              +{summary.tags.length - 5}
            </span>
          )}
        </div>
      </div>
    </Card>
  );
}
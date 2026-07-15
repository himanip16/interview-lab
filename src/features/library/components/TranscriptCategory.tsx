"use client";

import { TranscriptEntry } from "@/content/transcripts/types";

import TranscriptCard from "@/features/library/components/TranscriptCard";

type Props = {
  title: string;
  transcripts: TranscriptEntry[];
};

export default function TranscriptCategory({
  title,
  transcripts,
}: Props) {
  if (transcripts.length === 0) {
    return null;
  }

  return (
    <section className="space-y-5">
      <div className="border-b border-border pb-3">
        <h2 className="text-xl font-semibold tracking-tight">
          {title}
        </h2>

        <p className="mt-1 text-sm text-muted-foreground">
          {transcripts.length} transcript
          {transcripts.length === 1 ? "" : "s"}
        </p>
      </div>

      <div className="grid gap-4">
        {transcripts.map((transcript) => (
          <TranscriptCard
            key={transcript.summary.slug}
            transcript={transcript}
          />
        ))}
      </div>
    </section>
  );
}
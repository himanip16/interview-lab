import type { TranscriptEntry } from "@/content/transcripts/types";

export function adaptTranscript(transcript: any): TranscriptEntry {
  return {
    summary: {
      slug: transcript.slug,
      title: transcript.title,
      category: transcript.category,
      difficulty: transcript.difficulty,
      duration: transcript.duration ?? 0,
      company: transcript.company,
      tags: Array.isArray(transcript.tags) ? transcript.tags : [],
      description:
        typeof transcript.description === "string"
          ? transcript.description
          : "",
    },
    transcript: transcript.transcript ?? transcript,
  };
}
import type { TranscriptEntry } from "../types";

export function adaptTranscript(
  transcript: any
): TranscriptEntry {
  return {
    id: transcript.slug,

    slug: transcript.slug,

    title: transcript.title,

    category: transcript.category,

    difficulty: transcript.difficulty,

    company: transcript.company ?? null,

    interviewer: transcript.interviewer ?? null,

    candidate: transcript.candidate ?? null,

    duration: transcript.duration ?? null,

    summary:
      typeof transcript.description === "string"
        ? transcript.description
        : "",

    summaryData: {
      title: transcript.title,
      category: transcript.category,
      difficulty: transcript.difficulty,
      company: transcript.company ?? null,
      duration: transcript.duration ?? null,
      description:
        typeof transcript.description === "string"
          ? transcript.description
          : "",
      tags: Array.isArray(transcript.tags)
        ? transcript.tags
        : [],
    },

    transcript:
      transcript.transcript ?? transcript,

    createdAt: new Date(),

    updatedAt: new Date(),
  };
}
import { prisma } from "@/shared/prisma/client";

export interface TranscriptSummary {
  slug: string;
  title: string;
  description: string;
}

export interface TranscriptData {
  summary: TranscriptSummary;
  transcript: any; // The actual transcript data from Prisma
}

export async function getTranscript(slug: string): Promise<TranscriptData | null> {
  const transcript = await prisma.transcript.findUnique({
    where: { slug }
  });

  if (!transcript) {
    return null;
  }

  return {
    summary: {
      slug: transcript.slug,
      title: transcript.title,
      description: transcript.summary || '',
    },
    transcript: transcript.transcript,
  };
}

export async function getAllTranscripts(): Promise<TranscriptData[]> {
  const transcripts = await prisma.transcript.findMany({
    orderBy: { createdAt: 'desc' }
  });

  return transcripts.map(transcript => ({
    summary: {
      slug: transcript.slug,
      title: transcript.title,
      description: transcript.summary || '',
    },
    transcript: transcript.transcript,
  }));
}

import { getAllTranscripts } from "@/content/transcript/index";
import { NextResponse } from "next/server";


export async function GET() {
  try {
    const source = getAllTranscripts();

    const transcripts = source.map((item) => ({
  id: item.summary.slug,
  slug: item.summary.slug,
  title: item.summary.title,
  category: item.summary.category,
  difficulty: item.summary.difficulty,
  company: item.summary.company ?? null,

  interviewer: null,
  candidate: null,

  duration: item.summary.duration,

  summary: item.summary.description,

  transcript: item.transcript,

  createdAt: new Date(),
  updatedAt: new Date(),

  summaryData: {
    title: item.summary.title,
    category: item.summary.category,
    difficulty: item.summary.difficulty,
    company: item.summary.company ?? null,
    duration: item.summary.duration,
    description: item.summary.description,
    tags: item.summary.tags,
  },
}));
    console.info(`Fetched ${transcripts.length} transcript(s).`);

    return NextResponse.json(transcripts);
  } catch (error) {
    console.error("Failed to fetch transcripts:", error);

    return NextResponse.json(
      { error: "Failed to fetch transcripts" },
      { status: 500 }
    );
  }
}
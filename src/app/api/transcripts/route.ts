import { NextResponse } from "next/server";

import { getAllTranscripts } from "@/content/transcripts";

export async function GET() {
  try {
    const source = getAllTranscripts();

    const transcripts = source.map((item) => ({
      id: item.slug,
      slug: item.slug,
      title: item.title,
      category: item.category,
      difficulty: item.difficulty,
      company: item.company ?? null,
      interviewer: null,
      candidate: null,
      duration: item.duration ?? null,

      summary:
        typeof item.description === "string"
          ? item.description
          : null,

      transcript: item,

      createdAt: new Date(),
      updatedAt: new Date(),

      summaryData: {
        title: item.title,
        category: item.category,
        difficulty: item.difficulty,
        company: item.company ?? null,
        duration: item.duration ?? null,
        description:
          typeof item.description === "string"
            ? item.description
            : null,
        tags: item.tags ?? [],
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
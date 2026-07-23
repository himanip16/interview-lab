// src/app/api/transcripts/save/route.ts

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/features/auth/auth";
import { prisma } from "shared/prisma/client";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { transcriptSlug } = body;

    if (!transcriptSlug) {
      return NextResponse.json({ error: "transcriptSlug is required" }, { status: 400 });
    }

    // Find transcript by slug
    const transcript = await prisma.transcript.findUnique({
      where: { slug: transcriptSlug },
    });

    if (!transcript) {
      return NextResponse.json({ error: "Transcript not found" }, { status: 404 });
    }

    // Check if already saved
    const existing = await prisma.savedTranscript.findUnique({
      where: {
        userId_transcriptId: {
          userId: session.user.id,
          transcriptId: transcript.id,
        },
      },
    });

    if (existing) {
      return NextResponse.json({ message: "Already saved" }, { status: 200 });
    }

    // Save transcript
    const saved = await prisma.savedTranscript.create({
      data: {
        userId: session.user.id,
        transcriptId: transcript.id,
      },
    });

    return NextResponse.json({ saved }, { status: 201 });
  } catch (error) {
    console.error("Error saving transcript:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

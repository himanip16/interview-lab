// src/app/api/transcripts/bookmark/route.ts

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
    const { transcriptSlug, messageIndex, scrollPosition } = body;

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

    // Update or create bookmark
    const bookmark = await prisma.savedTranscript.upsert({
      where: {
        userId_transcriptId: {
          userId: session.user.id,
          transcriptId: transcript.id,
        },
      },
      update: {
        messageIndex: messageIndex ?? undefined,
        scrollPosition: scrollPosition ?? undefined,
        lastReadAt: new Date(),
      },
      create: {
        userId: session.user.id,
        transcriptId: transcript.id,
        messageIndex,
        scrollPosition,
        lastReadAt: new Date(),
      },
    });

    return NextResponse.json({ bookmark }, { status: 200 });
  } catch (error) {
    console.error("Error updating transcript bookmark:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const transcriptSlug = searchParams.get("transcriptSlug");

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

    // Get bookmark
    const bookmark = await prisma.savedTranscript.findUnique({
      where: {
        userId_transcriptId: {
          userId: session.user.id,
          transcriptId: transcript.id,
        },
      },
    });

    return NextResponse.json({ bookmark }, { status: 200 });
  } catch (error) {
    console.error("Error fetching transcript bookmark:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

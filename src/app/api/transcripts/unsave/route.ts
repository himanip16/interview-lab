import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/features/auth/auth";
import { prisma } from "@/shared/prisma/client";

export async function DELETE(request: NextRequest) {
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

    // Delete saved transcript
    await prisma.savedTranscript.deleteMany({
      where: {
        userId: session.user.id,
        transcriptId: transcript.id,
      },
    });

    return NextResponse.json({ message: "Unsaved" }, { status: 200 });
  } catch (error) {
    console.error("Error unsaving transcript:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// src/app/api/bug-hunting/attempts/[attemptId]/findings/route.ts
import { NextResponse } from "next/server";
import { getBugHuntingService } from "@/features/bug-hunting";
import { ensureGuestUser } from "@/features/auth/getCurrentUserId";

export async function POST(request: Request, { params }: { params: Promise<{ attemptId: string }> }) {
  try {
    const { attemptId } = await params;
    const { source, refId, note } = await request.json();
    const userId = await ensureGuestUser();

    const finding = await getBugHuntingService().recordFinding(attemptId, source, refId, note, userId);
    return NextResponse.json(finding.toJSON(), { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Failed" }, { status: 500 });
  }
}
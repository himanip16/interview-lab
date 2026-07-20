// src/app/api/bug-hunting/attempts/[attemptId]/hypothesis/route.ts
import { NextResponse } from "next/server";
import { getBugHuntingService } from "@/modules/bug-hunting";
import { ensureGuestUser } from "@/features/auth/getCurrentUserId";

export async function POST(request: Request, { params }: { params: Promise<{ attemptId: string }> }) {
  try {
    const { attemptId } = await params;
    const { scenarioId, hypothesis } = await request.json();
    const userId = await ensureGuestUser();

    await getBugHuntingService().logHypothesis(attemptId, scenarioId, hypothesis, userId);
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Failed" }, { status: 500 });
  }
}
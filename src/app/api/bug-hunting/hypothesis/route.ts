// src/app/api/bug-hunting/hypothesis/route.ts
import { NextResponse } from "next/server";
import { getBugHuntingService } from "@/features/bug-hunting";
import { ensureGuestUser } from "@/features/auth/getCurrentUserId";

export async function POST(request: Request) {
  try {
    const { attemptId, scenarioId, hypothesis } = await request.json();

    if (!attemptId || !scenarioId || typeof hypothesis !== "string") {
      return NextResponse.json(
        { error: "attemptId, scenarioId and hypothesis are required" },
        { status: 400 }
      );
    }

    const userId = await ensureGuestUser();
    const service = getBugHuntingService();

    await service.logHypothesis(
      attemptId,
      scenarioId,
      hypothesis,
      userId
    );

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}
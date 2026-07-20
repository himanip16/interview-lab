// src/app/api/bug-hunting/hypothesis/route.ts
import { NextResponse } from "next/server";
import { getBugHuntingService } from "@/features/bug-hunting";
import { ensureGuestUser } from "@/features/auth/getCurrentUserId";

export async function POST(request: Request) {
  try {
    const { scenarioId, hypothesis } = await request.json();
    if (!scenarioId || typeof hypothesis !== "string") {
      return NextResponse.json({ error: "scenarioId and hypothesis are required" }, { status: 400 });
    }

    const userId = await ensureGuestUser();
    const service = getBugHuntingService();
    await service.submitHypothesis(scenarioId, userId, hypothesis);

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}
// src/app/api/reviews/route.ts
import { NextResponse } from "next/server";
import { getReviewService } from "@/modules/pr-review";
import { ensureGuestUser } from "@/modules/auth/getCurrentUserId";

export async function POST(request: Request) {
  try {
    const { scenarioId } = await request.json();
    if (!scenarioId) return NextResponse.json({ error: "scenarioId is required" }, { status: 400 });

    const userId = await ensureGuestUser();
    const attempt = await getReviewService().startOrResumeAttempt(userId, scenarioId);
    return NextResponse.json(attempt.toProps(), { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Failed" }, { status: 500 });
  }
}

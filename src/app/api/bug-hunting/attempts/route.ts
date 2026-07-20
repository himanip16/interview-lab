// src/app/api/bug-hunting/attempts/route.ts
import { NextResponse } from "next/server";
import { getBugHuntingService } from "@/features/bug-hunting";
import { ensureGuestUser } from "@/features/auth/getCurrentUserId";

export async function POST(request: Request) {
  try {
    const { scenarioId } = await request.json();
    if (!scenarioId) return NextResponse.json({ error: "scenarioId is required" }, { status: 400 });

    const userId = await ensureGuestUser();
    const attempt = await getBugHuntingService().startOrResumeAttempt(userId, scenarioId);
    return NextResponse.json(attempt.toJSON(), { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Failed" }, { status: 500 });
  }
}
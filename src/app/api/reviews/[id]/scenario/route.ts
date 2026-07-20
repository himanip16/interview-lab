// src/app/api/reviews/[id]/scenario/route.ts
import { NextResponse } from "next/server";
import { getReviewService } from "@/features/pr-review";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const attempt = await getReviewService().getAttempt(id);
    if (!attempt) {
      return NextResponse.json({ error: "Attempt not found" }, { status:   404 });
    }

    const scenarioData = await getReviewService().getScenarioData(attempt.scenarioId);
    return NextResponse.json(scenarioData);
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Failed" }, { status: 500 });
  }
}

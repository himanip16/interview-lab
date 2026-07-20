// src/app/api/reviews/[id]/scenario/route.ts
import { NextResponse } from "next/server";
import { getReviewService } from "@/modules/pr-review";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const attempt = await getReviewService().getAttempt(params.id);
    if (!attempt) {
      return NextResponse.json({ error: "Attempt not found" }, { status:   404 });
    }

    const scenarioData = await getReviewService().getScenarioData(attempt.scenarioId);
    return NextResponse.json(scenarioData);
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Failed" }, { status: 500 });
  }
}

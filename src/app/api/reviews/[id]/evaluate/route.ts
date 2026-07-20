// src/app/api/reviews/[id]/evaluate/route.ts
import { NextResponse } from "next/server";
import { getReviewService } from "@/features/pr-review";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const report = await getReviewService().completeEvaluation(params.id);
    return NextResponse.json(report.toProps());
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Failed" }, { status: 500 });
  }
}

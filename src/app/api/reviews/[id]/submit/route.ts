// src/app/api/reviews/[id]/submit/route.ts
import { NextResponse } from "next/server";
import { getReviewService } from "@/features/pr-review";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { decision } = await request.json();
    const validDecisions = ["APPROVE", "REQUEST_CHANGES", "REJECT"];
    if (!decision || !validDecisions.includes(decision)) {
      return NextResponse.json({ error: "Invalid decision" }, { status: 400 });
    }

    const attempt = await getReviewService().submitReview({
      attemptId: id,
      decision,
    });

    return NextResponse.json(attempt.toProps());
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Failed" }, { status: 500 });
  }
}

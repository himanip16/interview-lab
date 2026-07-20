// src/app/api/reviews/[id]/submit/route.ts
import { NextResponse } from "next/server";
import { getReviewService } from "@/features/pr-review";
import { ReviewDecision } from "@prisma/client";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { decision } = await request.json();
    if (!decision || !Object.values(ReviewDecision).includes(decision)) {
      return NextResponse.json({ error: "Invalid decision" }, { status: 400 });
    }

    const attempt = await getReviewService().submitReview({
      attemptId: params.id,
      decision,
    });

    return NextResponse.json(attempt.toProps());
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Failed" }, { status: 500 });
  }
}

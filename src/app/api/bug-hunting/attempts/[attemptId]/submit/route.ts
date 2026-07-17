// src/app/api/bug-hunting/attempts/[attemptId]/submit/route.ts
import { NextResponse } from "next/server";
import { getBugHuntingService } from "@/modules/bug-hunting";

export async function POST(request: Request, { params }: { params: Promise<{ attemptId: string }> }) {
  try {
    const { attemptId } = await params;
    const { rootCause, proposedFix } = await request.json();

    const submission = await getBugHuntingService().submitFix(attemptId, rootCause, proposedFix);
    return NextResponse.json(submission.toJSON(), { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Failed" }, { status: 500 });
  }
}
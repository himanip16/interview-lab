// src/app/api/reviews/[id]/comments/route.ts
import { NextResponse } from "next/server";
import { getReviewService } from "@/features/pr-review";
import { ReviewComment } from "@/features/pr-review";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { fileId, side, line, anchorText, content } = await request.json();
    if (!fileId || !side || line === undefined || !content) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const comment = await getReviewService().addComment({
      attemptId: id,
      fileId,
      side,
      line,
      anchorText,
      content,
    });

    return NextResponse.json(comment.toProps(), { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Failed" }, { status: 500 });
  }
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const comments = await getReviewService().getComments(id);
    return NextResponse.json(comments.map((c: ReviewComment) => c.toProps()));
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Failed" }, { status: 500 });
  }
}

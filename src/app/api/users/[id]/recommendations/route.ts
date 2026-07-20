import { NextResponse } from "next/server";

import { RecommendationService } from "@/features/interview/application/services/recommendation/RecommendationService";

type Props = {
  params: Promise<{ id: string }>;
};

export async function GET(request: Request, { params }: Props) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: "Missing user id." },
        { status: 400 }
      );
    }

    const limitParam = new URL(request.url).searchParams.get("limit");

    const limit = limitParam
      ? Math.min(Math.max(parseInt(limitParam, 10) || 5, 1), 20)
      : 5;

    const service = new RecommendationService();
    const recommendations = await service.recommend(id, limit);

    return NextResponse.json({ recommendations }, { status: 200 });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
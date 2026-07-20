import { NextResponse } from "next/server";

import { RecommendationService } from "@/features/interview/recommendation/RecommendationService";
import { getCurrentUserId } from "@/features/auth/getCurrentUserId";

export async function GET(request: Request) {
  try {
    const userId = await getCurrentUserId();

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const limitParam = new URL(request.url).searchParams.get("limit");

    const limit = limitParam
      ? Math.min(Math.max(parseInt(limitParam, 10) || 5, 1), 20)
      : 5;

    const service = new RecommendationService();
    const recommendations = await service.recommend(userId, limit);

    return NextResponse.json({ recommendations }, { status: 200 });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}

// src/app/api/bug-hunting/sql/route.ts
import { NextResponse } from "next/server";
import { getBugHuntingService } from "@/features/bug-hunting";

export async function POST(request: Request) {
  try {
    const { scenarioId, query } = await request.json();
    const service = getBugHuntingService();
    const result = await service.runSqlQuery(scenarioId, query);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Query failed" },
      { status: 500 }
    );
  }
}
// src/app/api/bug-hunting/sql/route.ts

import { NextResponse } from "next/server";
import { getBugHuntingService } from "@/features/bug-hunting";

const BLOCKED_KEYWORDS = [
  "INSERT",
  "UPDATE",
  "DELETE",
  "DROP",
  "ALTER",
  "CREATE",
  "TRUNCATE",
  "GRANT",
  "REVOKE",
  "MERGE",
  "CALL",
  "EXEC",
  "EXECUTE",
];

export async function POST(request: Request) {
  try {
    const { scenarioId, query } = await request.json();

    if (!scenarioId || typeof scenarioId !== "string") {
      return NextResponse.json(
        { error: "Invalid scenarioId." },
        { status: 400 }
      );
    }

    if (!query || typeof query !== "string") {
      return NextResponse.json(
        { error: "Query is required." },
        { status: 400 }
      );
    }

    const normalizedQuery = query.trim().toUpperCase();

    if (!normalizedQuery.startsWith("SELECT")) {
      return NextResponse.json(
        {
          error: "Only SELECT queries are permitted.",
        },
        { status: 400 }
      );
    }

    for (const keyword of BLOCKED_KEYWORDS) {
      if (normalizedQuery.includes(keyword)) {
        return NextResponse.json(
          {
            error: `Query contains forbidden keyword: ${keyword}`,
          },
          { status: 400 }
        );
      }
    }

    const service = getBugHuntingService();
    const result = await service.runSqlQuery(scenarioId, query);

    return NextResponse.json(result);
  } catch (error) {
    console.error("SQL execution failed:", error);

    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Query failed",
      },
      {
        status: 500,
      }
    );
  }
}
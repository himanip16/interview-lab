// src/app/api/interviews/status/route.ts

import { NextResponse } from "next/server";

import { InterviewRepository } from "@/features/interview/infrastructure/repositories/InterviewRepository";

export async function GET(request: Request) {
  try {
    const id = new URL(request.url).searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Missing interview id." },
        { status: 400 }
      );
    }

    const repository = new InterviewRepository();

    const interview = await repository.getById(id);

    if (!interview) {
      return NextResponse.json(
        { error: "Interview not found." },
        { status: 404 }
      );
    }

    return NextResponse.json(interview);
  } catch (error) {
    console.error("Failed to fetch interview:", error);

    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
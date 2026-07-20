import { NextResponse } from "next/server";

import { InterviewProfileService } from "@/features/interview/profiles/InterviewProfileService";

export async function GET(request: Request) {
  try {
    const service = new InterviewProfileService();
    const templates = await service.listActive();

    return NextResponse.json({ templates }, { status: 200 });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}

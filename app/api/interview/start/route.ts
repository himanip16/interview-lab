import { NextResponse } from "next/server";

import { createInterview } from "@/modules/interview/services/InterviewFactory";
import { InterviewRepository } from "@/modules/interview/repository/InterviewRepository";
import { TranscriptService } from "@/modules/interview/services/TranscriptService";

export async function POST(
  request: Request
) {
    console.log("Received request to /api/interview/start"); // Add this line
  
try{
  const body =
    await request.json();

  const interview =
    createInterview(

      body.type,

      body.difficulty,

      body.duration,

      body.company

    );

  const repository =
    new InterviewRepository();

  await repository.save(interview);
  const transcript =
  new TranscriptService();

await transcript.addAssistantMessage(
  interview.id,
  "Welcome! Today we'll design a URL Shortener. Start by asking any clarifying questions."
);

  return NextResponse.json({

    id: interview.id,

  });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: String(error) },
      { status: 500 }
    );
  }

}
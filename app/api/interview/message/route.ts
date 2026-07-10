import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { InterviewEngine } from "@/modules/interview/engine/InterviewEngine";
// The import should work now
import type { Message } from "@prisma/client"; 

const engine = new InterviewEngine();

export async function POST(request: Request) {
  try {
    const { interviewId, message } = await request.json();

    const interview = await prisma.interview.findUnique({
  where: { id: interviewId },
  include: { transcript: true } // Correct field name
});

    if (!interview) return NextResponse.json({ error: "Not found" }, { status: 404 });

    // Save User Message
    await prisma.message.create({
      data: {
        content: message,
        role: 'user', 
        interviewId: interviewId
      }
    });

    // Run Engine - TypeScript will now recognize 'm' and 'interview.currentPhase'
    const result = await engine.processUserMessage(
      interview.currentPhase as any, 
      interview.transcript.map((m: Message) => ({ 
        role: m.role, 
        content: m.content 
      })),
      interview.type,
      "Candidate"
    );

    // Save AI Response
    const aiMessage = await prisma.message.create({
      data: {
        content: result.answer,
        role: 'assistant',
        interviewId: interviewId
      }
    });

    // Update the phase in DB
    await prisma.interview.update({
      where: { id: interviewId },
      data: { currentPhase: result.nextPhase }
    });

    return NextResponse.json(aiMessage);
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ error: "Check console for details" }, { status: 500 });
  }
}
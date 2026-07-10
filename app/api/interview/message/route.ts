import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { InterviewEngine } from "@/modules/interview/engine/InterviewEngine";
import type { Message } from "@prisma/client"; 

const engine = new InterviewEngine();

export async function POST(request: Request) {
  try {
    const { interviewId, message } = await request.json();

    // 1. Fetch interview
    const interview = await prisma.interview.findUnique({
      where: { id: interviewId },
      include: { transcript: { orderBy: { createdAt: 'asc' } } }
    });

    if (!interview) return NextResponse.json({ error: "Not found" }, { status: 404 });

    // 2. Save the NEW User Message first
    const newUserMessage = await prisma.message.create({
      data: {
        content: message,
        role: 'user', 
        interviewId: interviewId
      }
    });

    // 3. Prepare the history including the message just typed
    const history = [
      ...interview.transcript.map((m: Message) => ({ 
        role: m.role, 
        content: m.content 
      })),
      { role: 'user', content: message } // Add the current message manually
    ];

    // 4. Run Engine
    console.log("🚀 Sending to Engine with History Length:", history.length);
    
    const result = await engine.processUserMessage(
      interview.currentPhase as any, 
      history,
      interview.type,
      "Candidate"
    );

    // 5. Save AI Response
    const aiMessage = await prisma.message.create({
      data: {
        content: result.answer,
        role: 'assistant',
        interviewId: interviewId
      }
    });

    // 6. Update the phase in DB
    await prisma.interview.update({
      where: { id: interviewId },
      data: { currentPhase: result.nextPhase }
    });

    return NextResponse.json(aiMessage);

  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ error: "Check terminal logs" }, { status: 500 });
  }
}
import { NextResponse } from "next/server";
import { SummaryService } from "@/modules/interview/services/SummaryService";

import { prisma } from "@/lib/prisma";
import { AIService } from "@/modules/ai/AIService";
import { PromptBuilder } from "@/modules/interview/engine/PromptBuilder";
import { ResponseParser } from "@/modules/interview/engine/ResponseParser";
import {
  InterviewPhase,
  PhaseManager,
} from "@/modules/interview/engine/PhaseManager";

const aiService = new AIService();
const promptBuilder = new PromptBuilder();
const responseParser = new ResponseParser();
const phaseManager = new PhaseManager();

export async function POST(req: Request) {
  try {
    const { interviewId, message } = await req.json();

    if (!interviewId || !message?.trim()) {
      return NextResponse.json(
        { error: "Invalid request." },
        { status: 400 }
      );
    }

    const interview = await prisma.interview.findUnique({
      where: { id: interviewId },
      include: {
        transcript: {
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });

    if (!interview) {
      return NextResponse.json(
        { error: "Interview not found." },
        { status: 404 }
      );
    }

    // Save candidate message
    await prisma.message.create({
      data: {
        interviewId,
        role: "user",
        content: message,
      },
    });

    const systemPrompt = promptBuilder.buildSystemPrompt(
      interview.currentPhase as InterviewPhase,
      "Candidate",
      interview.company
    );

    const conversation = interview.transcript.map((m) => ({
      role: m.role,
      content: m.content,
    }));

    const aiResponse = await aiService.chat([
      {
        role: "system",
        content: systemPrompt,
      },
      ...conversation,
      {
        role: "user",
        content: message,
      },
    ]);

    const parsed = responseParser.parse(aiResponse);

    if (parsed.shouldTransition) {
      const nextPhase = phaseManager.getNextPhase(
        interview.currentPhase as InterviewPhase
      );

      await prisma.interview.update({
        where: {
          id: interviewId,
        },
        data: {
          currentPhase: nextPhase,
        },
      });
    }

    const summaryService = new SummaryService();
    const savedMessage = await prisma.message.create({
  data: {
    interviewId,
    role: "assistant",
    content: parsed.cleanMessage,
  },
});

/*
 * Fetch the latest transcript including the
 * candidate message and AI reply.
 */

const transcript = await prisma.message.findMany({
  where: {
    interviewId,
  },
  orderBy: {
    createdAt: "asc",
  },
});

/*
 * Generate running interview summary.
 */

const summary =
  await summaryService.generateSummary(
    transcript.map((m) => ({
      role: m.role,
      content: m.content,
    }))
  );

/*
 * Persist summary.
 */

await prisma.interview.update({
  where: {
    id: interviewId,
  },
  data: {
    summary,
  },
});

return NextResponse.json({
  aiMessage: savedMessage,
  transition: parsed.shouldTransition,
  newSummary: summary,
});

    return NextResponse.json({
      aiMessage: savedMessage,
      transition: parsed.shouldTransition,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "Internal server error.",
      },
      {
        status: 500,
      }
    );
  }
}
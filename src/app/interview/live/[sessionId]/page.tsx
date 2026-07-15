// src/app/interview/live/[sessionId]/page.tsx
import { prisma } from "@/shared/prisma/client";
import { notFound } from "next/navigation";
import LiveInterviewSession from "@/features/interview/live/components/LiveInterviewSession";

type Props = { params: Promise<{ sessionId: string }> };

export default async function LivePage({ params }: Props) {
  const { sessionId } = await params;

  const interview = await prisma.interview.findUnique({
    where: { id: sessionId },
    include: {
      problem: true,
      template: true,
      transcript: { orderBy: { createdAt: "asc" } },
    },
  });

  if (!interview) notFound();

  return (
    <LiveInterviewSession
      interviewId={interview.id}
      duration={interview.duration}
      problemTitle={interview.problem.title}
      currentPhase={interview.currentPhase}
      initialMessages={interview.transcript.map((m) => ({ role: m.role, content: m.content }))}
      initialSummary={interview.summary}
    />
  );
}
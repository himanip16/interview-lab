// app/interview/live/[id]/page.tsx
import { prisma } from "@/shared/prisma/client";
import LiveInterview from "@/src/features/interview/live/components/LiveInterview";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function Page({ params }: Props) {
  const { id } = await params;

  // 1. Change 'messages' to 'transcript'
  const interview = await prisma.interview.findUnique({
    where: { id },
    include: { 
      transcript: { 
        orderBy: { createdAt: 'asc' } 
      } 
    }
  });

  if (!interview) {
    return notFound();
  }

  return (
    <LiveInterview
  interviewId={interview.id}
  duration={interview.duration}
  initialMessages={interview.transcript}
  initialWhiteboardState={interview.whiteboardState}
/>
  );
}
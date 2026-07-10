// app/interview/live/[id]/page.tsx
import { prisma } from "@/lib/prisma";
import LiveInterview from "@/components/interview/live/LiveInterview";
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
      interviewId={id}
      // 2. Pass interview.transcript instead of interview.messages
      initialMessages={interview.transcript} 
    />
  );
}
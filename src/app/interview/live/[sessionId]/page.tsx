// app/interview/live/[sessionId]/page.tsx
import { prisma } from "@/shared/prisma/client";
import LiveInterview from "@/features/interview/live/components/LiveInterview";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ sessionId: string }>;
};
// app/interview/live/[sessionId]/page.tsx
export default async function LivePage({ params }: Props) {
  const { sessionId } = await params;

  const session = await prisma.interviewSession.findUnique({
    where: { id: sessionId }
  });

  if (!session) notFound();

  return (
    <LiveInterview
      interviewId={session.id}
      duration={session.duration}
      initialMessages={session.transcript as any}
      interviewTitle={session.interviewTitle || 'System Design Interview'}
      designSummary={session.designSummary as any || []}
      initialWhiteboardState={session.whiteboardState}
    />
  );
}
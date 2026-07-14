import { prisma } from "@/shared/prisma/client";
import { notFound } from "next/navigation";
import LiveInterviewClient from "@/features/interview/components/LiveInterviewClient";

export default async function SessionPage({ params }: { params: { sessionId: string } }) {
  const session = await prisma.interviewSession.findUnique({
    where: { id: params.sessionId }
  });

  if (!session) notFound();

  return (
    <div className="py-12 bg-[#FDFDFD] min-h-screen">
      {/* 
         Note: We cast transcript as any because Prisma Json types 
         need to be mapped to our DialogueNode interface 
      */}
      <LiveInterviewClient initialTranscript={session.transcript as any} />
    </div>
  );
}
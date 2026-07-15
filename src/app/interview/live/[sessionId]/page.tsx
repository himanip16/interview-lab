import { notFound } from "next/navigation";
import { prisma } from "@/shared/prisma/client";

type Props = {
  params: Promise<{
    sessionId: string;
  }>;
};

export default async function Page({ params }: Props) {
  const { sessionId } = await params;

  const interview = await prisma.interviewSession.findUnique({
    where: {
      id: sessionId,
    },
    include: {
      problem: true,
    },
  });

  if (!interview) {
    notFound();
  }

  return (
    <div>
      <h1>{interview.problem.title}</h1>

      {/* Render your interview UI here */}
    </div>
  );
}
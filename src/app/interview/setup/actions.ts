'use server'

import { prisma } from "@/shared/prisma/client";
import { redirect } from "next/navigation";

export async function createInterviewSession(data: {
  problemId: string;
  difficulty: string;
  userId: string | null;
  type: string;
}) {

  console.log("Server action started");
  // 1. Create the session in the DB
  const session = await prisma.interviewSession.create({
    data: {
      userId: data.userId,
      problemId: data.problemId,
      difficulty: data.difficulty,
      status: "STARTED",
      // We store a mock transcript for now. 
      // In production, you'd fetch the actual content based on problemId.
      transcript: [
        {
          id: "1",
          type: "interviewer",
          roleLabel: "Interviewer",
          text: "The database commits, but the service crashes before Kafka publish. What happens?"
        },
        {
          id: "2",
          type: "candidate",
          roleLabel: "Candidate",
          content: [
            { text: "I think " },
            { text: "Kafka guarantees delivery", highlight: "missed", explanation: "Kafka only guarantees delivery once the message reaches the broker. If the service crashes before publishing, the message is lost forever." }
          ]
        },
        {
            id: "3",
            type: "takeaway",
            text: "Use the Transactional Outbox pattern to ensure atomicity between DB commits and Message publishing."
        }
      ]
    }
  });
  console.log("Created session", session.id);

  // 2. Redirect to the unique session URL
  redirect(`/interview/live/${session.id}`);
}
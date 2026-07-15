// src/app/problems/actions.ts
"use server";

import { prisma } from "@/shared/prisma/client";
import { getCurrentUserId } from "@/modules/auth/getCurrentUserId";
import { redirect } from "next/navigation";

export async function startInterview(problemId: string) {
  const userId = await getCurrentUserId();

  const interview = await prisma.interviewSession.create({
    data: {
      userId: userId ?? null,
      problemId,
      status: "STARTED",
      transcript: [],
    },
  });

  redirect(`/interview/live/${interview.id}`);
}
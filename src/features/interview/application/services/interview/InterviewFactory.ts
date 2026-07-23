// src/features/interview/application/services/interview/InterviewFactory.ts

import { InterviewStatus, InterviewMode } from "@prisma/client";
import { CreateInterviewInput } from "@/features/interview/types/CreateInterviewInput";
import { PhaseId } from "@/features/interview/data/constants";

export function createInterview(input: CreateInterviewInput) {
  return {
    ...input,
    status: InterviewStatus.SETUP,
    currentPhase: PhaseId.Introduction,
    summary: "Interview has not started yet.",
    promptVersion: "v1",
    mode: input.mode ?? InterviewMode.CANDIDATE,
  };
}
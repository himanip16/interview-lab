import { InterviewStatus, InterviewMode } from "@prisma/client";
import { CreateInterviewInput } from "@/features/interview/types/CreateInterviewInput";

export function createInterview(input: CreateInterviewInput) {
  return {
    ...input,
    status: InterviewStatus.SETUP,
    currentPhase: "introduction",
    summary: "Interview has not started yet.",
    promptVersion: "v1",
    mode: input.mode ?? InterviewMode.CANDIDATE,
  };
}
import { InterviewStatus } from "@/src/modules/interview/types";
import { CreateInterviewInput } from "@/src/features/interview/types/CreateInterviewInput";

export function createInterview(input: CreateInterviewInput) {
  return {
    ...input,
    status: InterviewStatus.SETUP,
    currentPhase: "introduction",
    summary: "Interview has not started yet.",
    promptVersion: "v1",
  };
}
import {
  Difficulty,
  InterviewType,
} from "@prisma/client";

import { CreateInterviewInput } from "../../../../features/interview/types/CreateInterviewInput";

export function createInterview(
  input: CreateInterviewInput
): CreateInterviewInput {
  return input;
}
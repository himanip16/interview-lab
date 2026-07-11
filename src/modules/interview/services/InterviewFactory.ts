import {
  Difficulty,
  InterviewType,
} from "@prisma/client";

import { CreateInterviewInput } from "../types/CreateInterviewInput";

export function createInterview(
  input: CreateInterviewInput
): CreateInterviewInput {
  return input;
}
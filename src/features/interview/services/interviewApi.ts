import { z } from "zod";
import { StartInterviewResponseSchema } from "../setup/types/interview";

export interface StartInterviewPayload {
  type: string;
  difficulty: string;
  duration: number;
  company: string;
  problemId: string;
}

export async function startInterview(payload: StartInterviewPayload): Promise<{ id: string }> {
  const response = await fetch("/api/interviews/start", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  let data;
  try {
    data = await response.json();
  } catch {
    throw new Error("Invalid server response");
  }

  if (!response.ok) {
    throw new Error(data.error ?? "Failed to start interview");
  }

  // Validate response with Zod
  const validatedData = StartInterviewResponseSchema.parse(data);

  return { id: validatedData.id };
}

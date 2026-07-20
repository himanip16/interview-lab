import { MessageRole } from "@prisma/client";

export interface Message {
  id: string;

  interviewId: string;

  role: MessageRole;

  content: string;

  metadata?: Record<string, unknown>;

  createdAt: Date;
}
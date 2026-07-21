import { MessageRole } from "@prisma/client";

export interface TranscriptMessage {
  id: string;
  role: MessageRole;
  content: string;
  status?: "sending" | "sent" | "failed";
}
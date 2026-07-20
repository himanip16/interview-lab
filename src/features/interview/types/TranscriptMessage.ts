import { TranscriptRole } from "@/shared/config/common-constants";

export interface TranscriptMessage {
  id: string;
  role: TranscriptRole;
  content: string;
  status?: "sending" | "sent" | "failed";
}
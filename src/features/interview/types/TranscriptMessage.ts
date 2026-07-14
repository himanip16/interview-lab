import { TranscriptRole } from "@/shared/config/common-constants";

export interface TranscriptMessage {
  role: TranscriptRole;
  content: string;
}
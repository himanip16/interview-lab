export interface TranscriptMessage {
  role: "assistant" | "user";
  content: string;
}
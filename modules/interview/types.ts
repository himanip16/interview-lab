export enum InterviewStatus {
  SETUP = "SETUP",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
}
export interface TranscriptMessage {
  role: "assistant" | "user";
  content: string;
}

export interface InterviewState {
  id: string;

  type: string;

  difficulty: string;

  duration: number;

  company: string;

  status: InterviewStatus;

  createdAt: Date;

  transcript: TranscriptMessage[];
}
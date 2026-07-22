export type TranscriptEntry = {
  id: string;
  slug: string;
  title: string;
  category: string;
  difficulty: string;
  company?: string | null;
  interviewer?: string | null;
  candidate?: string | null;
  duration?: number | null;
  summary?: string | null;
  transcript: any;
  createdAt: Date;
  updatedAt: Date;
  summaryData?: {
    title: string;
    category: string;
    difficulty: string;
    company?: string | null;
    duration?: number | null;
    description?: string | null;
    tags?: string[];
  };
};

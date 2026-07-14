export type NodeRole = 'interviewer' | 'candidate' | 'takeaway';

export interface TranscriptPart {
  text: string;
  highlight?: 'strong' | 'missed';
  explanation?: string;
}

export interface TranscriptNode {
  id: string;
  role: NodeRole;
  content: TranscriptPart[];
  order: number;
}
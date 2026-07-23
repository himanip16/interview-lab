// src/features/interview/types/dialogue.ts

export type NodeType = 'interviewer' | 'candidate' | 'takeaway';

export interface DialogueNode {
  id: string;
  type: NodeType;
  roleLabel: string;
  text?: string;
  // For candidate highlights
  content?: {
    text: string;
    highlight?: 'strong' | 'missed';
    explanation?: string;
  }[];
}
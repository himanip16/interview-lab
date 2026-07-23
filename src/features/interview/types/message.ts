// src/features/interview/types/message.ts

// types/message.ts
export interface Message {
  id?: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  createdAt?: Date;
}
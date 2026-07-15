'use client';

import { useCallback, useState } from 'react';
import { interviewApiClient } from '@/shared/api/InterviewApiClient';
import type { ProcessInterviewMessageResult } from "@/modules/interview/types";

/**
 * Message data as stored in Prisma
 * Matches the Message model with actual field names
 */
export interface TranscriptMessage {
  id: string;
  role: 'assistant' | 'user'; // MessageRole enum
  content: string;
  metadata?: Record<string, any>;
  createdAt: string;
  elapsedSeconds: number;
  phase: string | null;
}

interface UseMessagesReturn {
  messages: TranscriptMessage[];
  sendMessage: (text: string) => Promise<ProcessInterviewMessageResult>;
  isSending: boolean;
  error: string | null;
}

/**
 * useMessages — Manage conversation with the AI interviewer
 *
 * Flow:
 * 1. User types message
 * 2. Add optimistic message to state (role: 'user')
 * 3. POST /api/interviews/[id]/message
 * 4. Add AI response (role: 'assistant')
 * 5. If backend updated phase/summary, parent component refetches interview state
 *
 * Why optimistic updates?
 * - Instant feedback to user
 * - No waiting for network
 * - Rollback on error
 *
 * Why no polling?
 * - Message list comes from the interview's transcript (refreshed via refetch())
 * - Polling would duplicate messages already in state
 * - Parent (LiveInterview) calls refetch() after sending to get latest state
 */
export function useMessages(
  interviewId: string,
  initialMessages: TranscriptMessage[] = []
): UseMessagesReturn {
  const [messages, setMessages] = useState<TranscriptMessage[]>(initialMessages);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = useCallback(
    async (text: string): Promise<ProcessInterviewMessageResult> => {
      if (!text.trim()) {
        throw new Error('Message cannot be empty');
      }

      setIsSending(true);
      setError(null);

      try {
        // Optimistic update: add user message immediately
        const optimisticUserMessage: TranscriptMessage = {
          id: `optimistic-${Date.now()}`,
          role: 'user',
          content: text.trim(),
          createdAt: new Date().toISOString(),
          elapsedSeconds: 0, // Calculated server-side
          phase: null, // Determined server-side
        };

        setMessages((prev) => [...prev, optimisticUserMessage]);

        // Send to backend
        const result = await interviewApiClient.sendMessage(
          interviewId,
          text
        );

        // Add AI response (backend-provided content)
        const assistantMessage: TranscriptMessage = {
          id: `assistant-${Date.now()}`,
          role: 'assistant',
          content: result.reply,
          metadata: {
            transitioned: result.transitioned,
            previousPhase: result.previousPhase,
            confidence: result.confidence,
          },
          createdAt: new Date().toISOString(),
          elapsedSeconds: 0, // Should come from backend in production
          phase: result.phase,
        };

        setMessages((prev) => [...prev, assistantMessage]);

        return result;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown error';
        setError(message);

        // Remove optimistic message on error
        setMessages((prev) => prev.slice(0, -1));

        throw err;
      } finally {
        setIsSending(false);
      }
    },
    [interviewId]
  );

  return {
    messages,
    sendMessage,
    isSending,
    error,
  };
}
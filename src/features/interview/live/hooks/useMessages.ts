// src/features/interview/live/hooks/useMessages.ts

'use client';

import { useCallback, useState } from 'react';
import { interviewApiClient } from '@/shared/api/InterviewApiClient';
import type { TranscriptMessage } from '../../types/TranscriptMessage';

interface UseMessagesReturn {
  messages: TranscriptMessage[];
  sendMessage: (text: string) => Promise<void>;
  isAssistantTyping: boolean;
  error: string | null;
  setMessages: (messages: TranscriptMessage[]) => void;
}

export function useMessages(
  interviewId: string,
  initialMessages: TranscriptMessage[] = []
): UseMessagesReturn {
  const [messages, setMessages] = useState<TranscriptMessage[]>(initialMessages);
  const [isAssistantTyping, setIsAssistantTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim()) {
        throw new Error("Message cannot be empty");
      }

      setError(null);

      // Generate temporary ID for optimistic update
      const tempId = `temp-${Date.now()}-${Math.random()}`;

      // Optimistically add user message with "sending" status
      setMessages(prev => [
        ...prev,
        {
          id: tempId,
          role: 'user',
          content: text.trim(),
          status: 'sending',
        },
      ]);

      setIsAssistantTyping(true);

      try {
        await interviewApiClient.sendMessage(
          interviewId,
          text.trim()
        );

        // On success, update the message status to "sent"
        setMessages(prev =>
          prev.map(msg =>
            msg.id === tempId
              ? { ...msg, status: 'sent' }
              : msg
          )
        );
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : "Unknown error";

        setError(message);

        // Mark message as failed
        setMessages(prev =>
          prev.map(msg =>
            msg.id === tempId
              ? { ...msg, status: 'failed' }
              : msg
          )
        );

        throw err;
      } finally {
        setIsAssistantTyping(false);
      }
    },
    [interviewId]
  );

  return {
    messages,
    sendMessage,
    isAssistantTyping,
    error,
    setMessages,
  };
}
'use client';

import { useCallback, useState } from 'react';
import { interviewApiClient } from '@/shared/api/InterviewApiClient';

interface UseMessagesReturn {
  sendMessage: (text: string) => Promise<void>;
  isSending: boolean;
  error: string | null;
}

export function useMessages(
  interviewId: string
): UseMessagesReturn {
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim()) {
        throw new Error("Message cannot be empty");
      }

      setIsSending(true);
      setError(null);

      try {
        await interviewApiClient.sendMessage(
          interviewId,
          text.trim()
        );
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : "Unknown error";

        setError(message);
        throw err;
      } finally {
        setIsSending(false);
      }
    },
    [interviewId]
  );

  return {
    sendMessage,
    isSending,
    error,
  };
}
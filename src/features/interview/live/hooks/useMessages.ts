import { useState, useCallback } from 'react';
import { TranscriptMessage } from '../../types/TranscriptMessage';

export function useMessages(interviewId: string, initialMessages: TranscriptMessage[]) {
  const [messages, setMessages] = useState<TranscriptMessage[]>(initialMessages);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = useCallback(async (content: string) => {
    setIsLoading(true);
    setError(null);

    try {
      // Add user message optimistically
      const userMessage: TranscriptMessage = { role: 'user', content };
      setMessages((prev) => [...prev, userMessage]);

      const response = await fetch(`/api/interviews/${interviewId}/message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: content }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to send message');
      }

      const data = await response.json();

      // Add assistant response
      const assistantMessage: TranscriptMessage = { role: 'assistant', content: data.reply };
      setMessages((prev) => [...prev, assistantMessage]);

      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      // Remove the optimistic user message on error
      setMessages((prev) => prev.slice(0, -1));
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [interviewId]);

  return { messages, sendMessage, isLoading, error };
}
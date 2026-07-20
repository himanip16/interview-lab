'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { interviewApiClient } from '@/shared/api/InterviewApiClient';
import type { InterviewState } from '@/features/interview/types/InterviewState';
interface UseInterviewReturn {
  interview: InterviewState | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * useInterview — Fetch interview state
 *
 * - Loads interview data on mount
 * - Does NOT poll — polling is wasteful for chat apps
 * - Data updates via explicit actions (sending messages, refetching)
 * - Backend owns all state transitions (phases, summaries, completion)
 *
 * Why no polling?
 * - User actions already trigger updates (POST /message)
 * - Interview state only changes when backend updates it
 * - Polling every second = wasted requests
 * - For real-time features later: use SSE or WebSocket
 */
export function useInterview(interviewId: string): UseInterviewReturn {
  const [interview, setInterview] = useState<InterviewState | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const fetchInterview = useCallback(async () => {
    // GUARD: Don't fetch if the ID is missing or literal "undefined"
    if (!interviewId || interviewId === 'undefined') return;

    try {
      setLoading(true);
      setError(null);
      const data = await interviewApiClient.getInterview(interviewId);
      setInterview(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);

      // Only redirect if we are SURE the interview doesn't exist in the DB
      if (message.includes('not found')) {
        router.push('/dashboard');
      }
    } finally {
      setLoading(false);
    }
  }, [interviewId, router]);

  // Fetch once on mount
  useEffect(() => {
    fetchInterview();
  }, [fetchInterview]);

  return {
    interview,
    loading,
    error,
    refetch: fetchInterview,
  };
}
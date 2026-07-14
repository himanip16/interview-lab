import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export interface InterviewData {
  id: string;
  status: string;
  currentPhase: string;
  summary: string | null;
  problem: {
    title: string;
  };
}

export function useInterview(interviewId: string) {
  const [interview, setInterview] = useState<InterviewData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchInterview() {
      try {
        const response = await fetch(`/api/interviews/${interviewId}`);
        if (!response.ok) {
          if (response.status === 404) {
            router.push('/dashboard');
            return;
          }
          throw new Error('Failed to fetch interview');
        }
        const data = await response.json();
        setInterview(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    }

    fetchInterview();
  }, [interviewId, router]);

  return { interview, loading, error };
}
'use client';

import { useCallback } from 'react';
import { Prisma } from '@prisma/client';

import { InterviewHeader } from './InterviewHeader';
import { PhaseProgress } from './PhaseProgress';
import { MessageList } from './MessageList';
import { ChatInput } from './ChatInput';
import { Sidebar } from './Sidebar';

import { useInterview } from '../hooks/useInterview';
import { useMessages } from '../hooks/useMessages';
import { useTimer } from '../hooks/useTimer';
import logger from '@/shared/logger/logger';

// Type representing the API response with relations included
export type InterviewWithRelations = Prisma.InterviewGetPayload<{
  include: {
    problem: true;
    transcript: true;
  };
}>;

interface LiveInterviewProps {
  interviewId: string;
}

export function LiveInterview({ interviewId }: LiveInterviewProps) {
  const { interview, loading, error, refetch } = useInterview(interviewId);
  const {
    sendMessage,
    isSending,
    error: messageError,
  } = useMessages(interviewId);

  const { remainingSeconds } = useTimer({
    startedAt: interview?.createdAt ?? null,
    durationMinutes: interview?.duration ?? 0,
    isRunning: interview?.status === 'IN_PROGRESS',
  });

  const handleSendMessage = useCallback(
    async (text: string) => {
      if (isSending || !text.trim()) return;

      try {
        await sendMessage(text);
        // Refresh interview state to get the AI's response and potential phase changes
        await refetch();
      } catch (err: any) {
        // Improved error extraction
        const errorMessage = err.response?.data?.error || err.message || 'Unknown error';
        
        console.error("DETAILED ERROR:", {
          message: errorMessage,
          stack: err.stack,
          status: err.response?.status,
          raw: err
        });

        logger.error('Failed to send interview message', err, { interviewId });
      }
    },
    [isSending, sendMessage, refetch, interviewId]
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-600">Loading interview...</p>
      </div>
    );
  }

  if (error || !interview) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-600">{error || 'Failed to load interview'}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-white">
      <InterviewHeader
        title={interview.problem.title}
        isLive={interview.status === 'IN_PROGRESS'}
        remainingSeconds={remainingSeconds}
      />

      <PhaseProgress
        currentPhase={interview.currentPhase}
        isCompleted={interview.status === 'COMPLETED'}
      />

      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 flex flex-col">
          <MessageList messages={interview.transcript} />
          <ChatInput
            onSendMessage={handleSendMessage}
            isSending={isSending}
            error={messageError}
            isInterviewCompleted={interview.status === 'COMPLETED'}
          />
        </div>

        <Sidebar
  problem={interview.problem}
  currentPhase={interview.currentPhase}
  // 1. Fixes the 'string | null' error by providing '' if null
  summary={interview.summary ?? ''} 
  
  // 2. Fixes missing property errors by accessing the problem sub-object
  // and providing fallback values if they are optional in your schema
  difficulty={(interview.problem as any).difficulty ?? 'Intermediate'} 
  company={(interview.problem as any).company ?? 'General'}
/>
      </div>
    </div>
  );
}
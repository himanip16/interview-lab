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
import { logger } from '@/lib/logger'; // Replace with your logger path

// 1. Accurate type representing the API response with relations included
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

  // 2 & 8. Hook owns calculation logic directly — no wrapper component or empty callback needed
  const { remainingSeconds } = useTimer({
    startedAt: interview?.createdAt ?? null,
    durationMinutes: interview?.duration ?? 0,
    isRunning: interview?.status === 'IN_PROGRESS',
  });

  const handleSendMessage = useCallback(
    async (text: string) => {
      // 5. Send guard
      if (isSending || !text.trim()) return;

      try {
        await sendMessage(text);
        
        // 6. Refresh interview state because the backend owns transcript updates,
        // phase transitions, and summary generation.
        await refetch();
      } catch (err) {
        // 3. Logger instead of console.error
        logger.error('Failed to send interview message', { err, interviewId });
      }
    },
    [isSending, sendMessage, refetch, interviewId]
  );

  const problemForSidebar = {
    ...interview?.problem,
    description: (interview?.problem as { description?: string | null } | undefined)?.description ?? null,
  };

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
          summary={interview.summary}
          difficulty={interview.difficulty}
          company={interview.company}
        />
      </div>
    </div>
  );
}
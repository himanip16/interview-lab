// src/features/interview/live/components/LiveInterview.tsx

'use client';

import { useCallback, useEffect } from 'react';
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

export type InterviewWithRelations =
  Prisma.InterviewGetPayload<{
    include: {
      problem: true;
      transcript: true;
    };
  }>;

interface LiveInterviewProps {
  interviewId: string;
}

export function LiveInterview({
  interviewId,
}: LiveInterviewProps) {
  const {
    interview,
    loading,
    error,
    refetch,
  } = useInterview(interviewId);

  const initialMessages =
    interview?.transcript?.map((msg) => ({
      id: msg.id,
      role: msg.role,
      content: msg.content,
      status: 'sent' as const,
    })) ?? [];


  const {
    messages,
    sendMessage,
    isAssistantTyping,
    error: messageError,
    setMessages,
  } = useMessages(
    interviewId,
    initialMessages
  );


  const { remainingSeconds } = useTimer({
    startedAt: interview?.createdAt ?? null,
    durationMinutes: interview?.duration ?? 0,
    isRunning:
      interview?.status === 'IN_PROGRESS',
  });


  const handleSendMessage = useCallback(
    async (text: string) => {
      if (!text.trim()) return;

      try {
        await sendMessage(text);
        await refetch();

      } catch (err: any) {
        logger.error(
          'Failed to send interview message',
          {
            error:
              err.message ??
              'Unknown error',
            interviewId,
          }
        );
      }
    },
    [
      sendMessage,
      refetch,
      interviewId,
    ]
  );


  useEffect(() => {
    if (interview?.transcript) {
      setMessages(
        interview.transcript.map((msg) => ({
          id: msg.id,
          role: msg.role,
          content: msg.content,
          status: 'sent' as const,
        }))
      );
    }
  }, [
    interview?.transcript,
    setMessages,
  ]);


  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading interview...
      </div>
    );
  }


  if (error || !interview) {
    return (
      <div className="flex items-center justify-center h-screen text-red-600">
        {error ?? 'Failed to load interview'}
      </div>
    );
  }


  return (
    <div className="flex flex-col h-screen bg-white">

      <InterviewHeader
        title={interview.problem.title}
        isLive={
          interview.status === 'IN_PROGRESS'
        }
        remainingSeconds={remainingSeconds}
      />


      <PhaseProgress
        currentPhase={interview.currentPhase}
        isCompleted={
          interview.status === 'COMPLETED'
        }
      />


      <div className="flex flex-1 overflow-hidden">

        <div className="flex-1 flex flex-col">

          <MessageList
            messages={messages}
            isAssistantTyping={
              isAssistantTyping
            }
          />


          <ChatInput
            onSendMessage={handleSendMessage}
            isSending={
              isAssistantTyping
            }
            error={messageError}
            isInterviewCompleted={
              interview.status === 'COMPLETED'
            }
            disabled={
              isAssistantTyping
            }
          />

        </div>


        <Sidebar
          problem={interview.problem}
          currentPhase={interview.currentPhase}
          summary={
            interview.summary ?? ''
          }
          difficulty={
            (interview.problem as any)
              .difficulty ?? 'Intermediate'
          }
          company={
            (interview.problem as any)
              .company ?? 'General'
          }
        />

      </div>

    </div>
  );
}
'use client';

import { InterviewHeader } from './InterviewHeader';
import { PhaseProgress } from './PhaseProgress';
import { MessageList } from './MessageList';
import { ChatInput } from './ChatInput';
import { Sidebar } from './Sidebar';
import { useInterview } from '../hooks/useInterview';
import { useMessages } from '../hooks/useMessages';
import { useTimer } from '../hooks/useTimer';

interface LiveInterviewProps {
  interviewId: string;
}

/**
 * LiveInterview - Main container
 *
 * Orchestrates:
 * - Interview state (from useInterview hook)
 * - Message history (from useMessages hook)
 * - Message sending (delegates to useMessages, then refetches interview state)
 * - Layout and component composition
 *
 * Data flow:
 * 1. Mount → fetch interview state and transcript
 * 2. User sends message → POST to backend via useMessages
 * 3. Message added to state optimistically
 * 4. AI response returned immediately (no polling)
 * 5. Refetch interview state to get updated phase/summary
 *
 * Backend owns:
 * - Phase transitions
 * - Summary updates
 * - Interview completion
 * - Evaluation queuing
 *
 * Frontend shows:
 * - Messages from transcript
 * - Current phase and progress
 * - Design summary (from interview.summary)
 * - Problem context
 * - Timer (duration - elapsed)
 */
export function LiveInterview({ interviewId }: LiveInterviewProps) {
  const { interview, loading, error, refetch } = useInterview(interviewId);
  const {
  sendMessage,
  isSending,
  error: messageError,
} = useMessages(interviewId);
  const handleSendMessage = async (text: string) => {
    try {
      // Send message (optimistically updates local state)
      const result = await sendMessage(text);

      // Refetch interview state to get:
      // - Updated phase (if transition occurred)
      // - Updated summary
      // - Interview completion status
      // - New evaluation state
      await refetch();
    } catch (err) {
      console.error('Failed to send message:', err);
      // Error is stored in hook, displayed in UI
    }
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

  // Calculate elapsed time
  const startedAt = interview.startedAt
    ? new Date(interview.startedAt).getTime()
    : new Date(interview.createdAt).getTime();
  const elapsedSeconds = Math.floor((Date.now() - startedAt) / 1000);
  const remainingSeconds = Math.max(0, interview.duration * 60 - elapsedSeconds);

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Header */}
      <InterviewHeader
        title={interview.problem.title}
        isLive={interview.status === 'IN_PROGRESS'}
        remainingSeconds={remainingSeconds}
      />

      {/* Phase Progress */}
      <PhaseProgress
        currentPhase={interview.currentPhase}
        isCompleted={interview.status === 'COMPLETED'}
      />

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          <MessageList messages={interview.transcript} />
          <ChatInput
            onSendMessage={handleSendMessage}
            isSending={isSending}
            error={messageError}
            isInterviewCompleted={interview.status === 'COMPLETED'}
          />
        </div>

        {/* Sidebar */}
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
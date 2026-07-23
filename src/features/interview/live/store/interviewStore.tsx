// src/features/interview/live/store/interviewStore.tsx

import { createContext, useContext, useState, ReactNode } from 'react';
import { TranscriptMessage } from '../../types/TranscriptMessage';

interface InterviewStore {
  interviewId: string | null;
  messages: TranscriptMessage[];
  currentPhase: string;
  summary: string | null;
  isSending: boolean;
  setInterviewId: (id: string) => void;
  setMessages: (messages: TranscriptMessage[]) => void;
  addMessage: (message: TranscriptMessage) => void;
  setCurrentPhase: (phase: string) => void;
  setSummary: (summary: string | null) => void;
  setIsSending: (sending: boolean) => void;
  reset: () => void;
}

const InterviewContext = createContext<InterviewStore | undefined>(undefined);

export function InterviewProvider({ children }: { children: ReactNode }) {
  const [interviewId, setInterviewId] = useState<string | null>(null);
  const [messages, setMessages] = useState<TranscriptMessage[]>([]);
  const [currentPhase, setCurrentPhase] = useState('intro');
  const [summary, setSummary] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);

  const addMessage = (message: TranscriptMessage) => {
    setMessages((prev) => [...prev, message]);
  };

  const reset = () => {
    setInterviewId(null);
    setMessages([]);
    setCurrentPhase('intro');
    setSummary(null);
    setIsSending(false);
  };

  return (
    <InterviewContext.Provider
      value={{
        interviewId,
        messages,
        currentPhase,
        summary,
        isSending,
        setInterviewId,
        setMessages,
        addMessage,
        setCurrentPhase,
        setSummary,
        setIsSending,
        reset,
      }}
    >
      {children}
    </InterviewContext.Provider>
  );
}

export function useInterviewStore() {
  const context = useContext(InterviewContext);
  if (!context) {
    throw new Error('useInterviewStore must be used within InterviewProvider');
  }
  return context;
}
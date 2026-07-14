"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Timer from "./Timer";
import Chat from "./Chat";
import Sidebar from "./Sidebar";
import InterviewHeader from "./InterviewHeader";
import { useInterview } from "../hooks/useInterview";
import { useMessages } from "../hooks/useMessages";
import { TranscriptMessage } from "../../types/TranscriptMessage";

type Props = {
  interviewId: string;
  duration: number;
  initialMessages: TranscriptMessage[];
};

export default function LiveInterview({ interviewId, duration, initialMessages }: Props) {
  const router = useRouter();
  const { interview, loading: interviewLoading } = useInterview(interviewId);
  const { messages, sendMessage, isLoading: messageLoading, error: messageError } = useMessages(interviewId, initialMessages);
  const [currentPhase, setCurrentPhase] = useState(interview?.currentPhase || "intro");
  const [summary, setSummary] = useState(interview?.summary || null);

  useEffect(() => {
    if (interview) {
      setCurrentPhase(interview.currentPhase);
      setSummary(interview.summary);
    }
  }, [interview]);

  const handleFinish = async () => {
    const response = await fetch(`/api/interviews/${interviewId}/finish`, {
      method: 'POST',
    });
    if (response.ok) {
      router.push(`/interview/report/${interviewId}`);
    }
  };

  if (interviewLoading) {
    return (
      <div className="min-h-screen bg-[#FAF9F6] flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-[#00A87E] border-t-transparent rounded-full animate-spin mx-auto mb-4" />\n          <p className="text-[#5A5B66]">Loading interview...</p>
        </div>
      </div>
    );
  }

  if (!interview) {
    return (
      <div className="min-h-screen bg-[#FAF9F6] flex items-center justify-center">
        <p className="text-[#5A5B66]">Interview not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF9F6] py-10 px-6">
      <div className="max-w-[1080px] mx-auto bg-white rounded-[32px] overflow-hidden shadow-[0_24px_60px_rgba(21,22,28,0.06)] border border-[rgba(21,22,28,0.06)]">
        <InterviewHeader duration={duration} interviewId={interviewId} />
        
        <div className="body flex h-[520px]">
          <Chat 
            messages={messages} 
            onSendMessage={sendMessage} 
            isLoading={messageLoading} 
          />
          <Sidebar 
            summary={summary} 
            phase={currentPhase} 
            isSummaryLoading={interviewLoading}
          />
        </div>
      </div>
    </div>
  );
}

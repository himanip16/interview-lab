'use client';

import { useState } from 'react';
import Chat from './Chat';
import Sidebar from './Sidebar';
import InterviewHeader from './InterviewHeader';
import { useToast } from '../../../../components/ui/Toast';
import { TranscriptMessage } from '../../types/TranscriptMessage';

interface LiveInterviewProps {
  interviewId: string;
  duration: number;
  initialMessages: TranscriptMessage[];
}

export default function LiveInterview({
  interviewId,
  duration,
  initialMessages,
}: LiveInterviewProps) {
  const [messages, setMessages] = useState(initialMessages);
  const [isLoading, setIsLoading] = useState(false);
  const [summary, setSummary] = useState("Establishing connection...");
  const { showToast } = useToast();

  const handleSendMessage = async (content: string) => {
    setIsLoading(true);

    const userMsg: TranscriptMessage = {
      role: "user",
      content,
    };

    setMessages((prev) => [...prev, userMsg]);

    try {
      const response = await fetch(
  `/api/interviews/${interviewId}/message`,
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message: content,
    }),
  }
);

      const text = await response.text();

      if (process.env.NODE_ENV === "development") {
        console.log("Status:", response.status);
        console.log("Response:", text);
      }

      if (!response.ok) {
        showToast(text, "error");
        return;
      }

const data = JSON.parse(text);

      if (data.aiMessage) {
        setMessages((prev) => [...prev, data.aiMessage]);
      }

      if (data.newSummary) {
        setSummary(data.newSummary);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <div className="flex flex-1 flex-col">
        <InterviewHeader
          duration={duration}
          interviewId={interviewId}
        />

        <Chat
          messages={messages}
          onSendMessage={handleSendMessage}
          isLoading={isLoading}
        />
      </div>

      <Sidebar summary={summary} />
    </div>
  );
}
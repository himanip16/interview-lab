'use client';

import { useState } from 'react';
import Chat from './Chat';
import Sidebar from './Sidebar';
import InterviewHeader from './InterviewHeader';

interface LiveInterviewProps {
  interviewId: string;
  duration: number;
  initialMessages: any[];
}

export default function LiveInterview({
  interviewId,
  duration,
  initialMessages,
}: LiveInterviewProps) {
  const [messages, setMessages] = useState(initialMessages);
  const [isLoading, setIsLoading] = useState(false);
  const [summary, setSummary] = useState("Establishing connection...");

  const handleSendMessage = async (content: string) => {
    setIsLoading(true);

    const userMsg = {
      id: `temp-${Date.now()}`,
      role: "user",
      content,
    };

    setMessages((prev) => [...prev, userMsg]);

    try {
      const response = await fetch("/api/interview/message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          interviewId,
          message: content,
        }),
      });

      const data = await response.json();

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
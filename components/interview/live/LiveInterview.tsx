"use client"; // Mandatory for useState

import { useState } from 'react';
import MessageList from './MessageList';
import ChatInput from './ChatInput';

interface LiveInterviewProps {
  interviewId: string;
  initialMessages?: any[];
}

export default function LiveInterview({ interviewId, initialMessages = [] }: LiveInterviewProps) {
  const [messages, setMessages] = useState(initialMessages);
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;

    // Optimistic update
    const userMsg = { id: Date.now().toString(), role: 'user', content: text };
    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const response = await fetch('/api/interview/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ interviewId, message: text }),
      });

      const aiMsg = await response.json();
      setMessages((prev) => [...prev, aiMsg]);
    } catch (error) {
      console.error("Failed to send message", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-64px)]">
      <MessageList messages={messages} />
      {isLoading && <div className="p-4 text-sm text-gray-500 animate-pulse">Interviewer is thinking...</div>}
      <ChatInput onSend={handleSendMessage} disabled={isLoading} />
    </div>
  );
}
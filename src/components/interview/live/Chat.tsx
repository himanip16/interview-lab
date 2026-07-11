// components/interview/live/Chat.tsx
'use client';
import { useRef, useEffect } from 'react';
import MessageList from './MessageList';
import ChatInput from './ChatInput';

interface ChatProps {
  messages: any[];
  onSendMessage: (msg: string) => void;
  isLoading: boolean;
}

export default function Chat({ messages, onSendMessage, isLoading }: ChatProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  return (
    <div className="flex flex-col h-full bg-white">
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6">
        <MessageList messages={messages} />
        {isLoading && (
          <div className="flex gap-3 animate-pulse">
            <div className="w-8 h-8 bg-slate-200 rounded-full" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-slate-100 rounded w-1/4" />
              <div className="h-10 bg-slate-50 rounded w-3/4" />
            </div>
          </div>
        )}
      </div>
      <div className="p-4 border-t bg-slate-50">
        <ChatInput onSendMessage={onSendMessage} disabled={isLoading} />
      </div>
    </div>
  );
}
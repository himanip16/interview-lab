// components/interview/live/Chat.tsx
'use client';
import { useRef, useEffect } from 'react';
import MessageList from './MessageList';
import ChatInput from './ChatInput';
import { TranscriptMessage } from '../../types/TranscriptMessage';

interface ChatProps {
  messages: TranscriptMessage[];
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
    <div className="flex flex-col h-full bg-zinc-950">
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 space-y-6"
        aria-live="polite"
        aria-atomic="false"
      >
        <MessageList messages={messages} />
        {isLoading && (
          <div className="flex gap-3 animate-pulse">
            <div className="w-8 h-8 bg-zinc-800 rounded-full" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-zinc-800 rounded w-1/4" />
              <div className="h-10 bg-zinc-800 rounded w-3/4" />
            </div>
          </div>
        )}
      </div>
      <div className="p-4 border-t border-zinc-800 bg-zinc-900">
        <ChatInput onSendMessage={onSendMessage} disabled={isLoading} />
      </div>
    </div>
  );
}
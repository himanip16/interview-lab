'use client';

import { useRef, useEffect } from 'react';

import { MessageList } from '@/features/interview/live/components/MessageList';
import { ChatInput } from './ChatInput';
import { TranscriptMessage } from '../../types/TranscriptMessage';

interface ChatProps {
  messages: TranscriptMessage[];
  onSendMessage: (msg: string) => void;
  isLoading: boolean;
}

export default function Chat({
  messages,
  onSendMessage,
  isLoading,
}: ChatProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop =
        scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  return (
    <div className="flex flex-col h-full bg-background">
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 space-y-4"
        aria-live="polite"
        aria-atomic="false"
      >
        <MessageList messages={messages} />

        {isLoading && (
          <div className="flex gap-3 animate-pulse">
            <div className="w-8 h-8 bg-muted rounded-full" />

            <div className="flex-1 space-y-2">
              <div className="h-4 bg-muted rounded w-1/4" />
              <div className="h-10 bg-muted rounded w-3/4" />
            </div>
          </div>
        )}
      </div>

      <div className="p-6 border-t border-border bg-card">
        <ChatInput
          onSendMessage={onSendMessage}
          disabled={isLoading}
        />
      </div>
    </div>
  );
}
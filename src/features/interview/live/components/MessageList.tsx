'use client';

import React, { useEffect, useRef } from 'react';
import { Message } from './Message';
import { TypingIndicator } from './TypingIndicator';
import type { TranscriptMessage } from '../../types/TranscriptMessage';

interface MessageListProps {
  messages: TranscriptMessage[];
  isAssistantTyping?: boolean;
}

/**
 * MessageList - Renders conversation history
 *
 * Features:
 * - Auto-scrolls to latest message
 * - Handles empty state
 * - Message ordering (oldest first)
 * - Shows typing indicator when assistant is responding
 *
 * Note: Messages come from useMessages hook,
 * which is the single source of truth for message state.
 */
export function MessageList({ messages, isAssistantTyping = false }: MessageListProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const endRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive or typing status changes
  useEffect(() => {
    const timer = setTimeout(() => {
      endRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100); // Small delay to allow layout calculation
    return () => clearTimeout(timer);
  }, [messages, isAssistantTyping]);

  return (
    <div
      ref={containerRef}
      className="flex-1 overflow-y-auto px-6 py-6 space-y-4 bg-white"
    >
      {messages.length === 0 && !isAssistantTyping ? (
        <div className="flex items-center justify-center h-full">
          <p className="text-gray-400">No messages yet</p>
        </div>
      ) : (
        <>
          {messages.map((msg) => (
            <Message
              key={msg.id}
              role={msg.role}
              content={msg.content}
              status={msg.status}
            />
          ))}
          {isAssistantTyping && <TypingIndicator />}
          <div ref={endRef} />
        </>
      )}
    </div>
  );
}
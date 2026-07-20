'use client';

import React, { useEffect, useRef } from 'react';
import { Message } from './Message';
import type { TranscriptMessage } from '../../types/TranscriptMessage';

interface MessageListProps {
  messages: TranscriptMessage[];
}

/**
 * MessageList - Renders conversation history
 *
 * Features:
 * - Auto-scrolls to latest message
 * - Handles empty state
 * - Message ordering (oldest first)
 *
 * Note: Messages come from the interview's transcript,
 * which is the source of truth on the backend.
 */
export function MessageList({ messages }: MessageListProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const endRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    const timer = setTimeout(() => {
      endRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100); // Small delay to allow layout calculation
    return () => clearTimeout(timer);
  }, [messages]);

  return (
    <div
      ref={containerRef}
      className="flex-1 overflow-y-auto px-6 py-6 space-y-4 bg-white"
    >
      {messages.length === 0 ? (
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
            />
          ))}
          <div ref={endRef} />
        </>
      )}
    </div>
  );
}
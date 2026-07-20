'use client';

import React from 'react';
import ReactMarkdown from 'react-markdown';

interface MessageProps {
  role: 'assistant' | 'user';
  content: string;
  status?: 'sending' | 'sent' | 'failed';
}

/**
 * Message - Renders a single message bubble
 *
 * Props:
 * - role: 'assistant' (interviewer) or 'user' (candidate)
 * - content: The message text (supports markdown)
 * - status: Optional status for optimistic UI updates
 *
 * Styling:
 * - User: black bubble, right-aligned
 * - Assistant: gray bubble, left-aligned
 */
export function Message({ role, content, status }: MessageProps) {
  const isUser = role === 'user';

  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      {!isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
          <span className="text-xs font-semibold text-gray-700">I</span>
        </div>
      )}

      <div
        className={`max-w-md px-4 py-3 rounded-2xl ${
          isUser
            ? 'bg-black text-white rounded-tr-none'
            : 'bg-gray-200 text-gray-900 rounded-tl-none'
        }`}
      >
        {!isUser && (
          <p className="text-xs font-semibold text-gray-600 mb-1">Interviewer</p>
        )}
        <div className="text-sm leading-relaxed prose prose-sm max-w-none">
          <ReactMarkdown>{content}</ReactMarkdown>
        </div>
        {status === 'sending' && (
          <span className="text-xs text-gray-400 mt-2 block">Sending...</span>
        )}
        {status === 'failed' && (
          <span className="text-xs text-red-500 mt-2 block">Failed to send</span>
        )}
      </div>
    </div>
  );
}
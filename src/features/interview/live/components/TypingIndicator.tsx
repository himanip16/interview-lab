// src/features/interview/live/components/TypingIndicator.tsx

'use client';

import React from 'react';

/**
 * TypingIndicator - Shows when the assistant is generating a response
 */
export function TypingIndicator() {
  return (
    <div className="flex items-center gap-2 px-4 py-3 bg-gray-50 rounded-lg w-fit">
      <div className="flex gap-1">
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
      </div>
      <span className="text-sm text-gray-500">AI is typing...</span>
    </div>
  );
}

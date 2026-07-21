'use client';

import React, { useState } from 'react';
import { Mic, ArrowRight } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (msg: string) => void;
  disabled?: boolean;
  isSending?: boolean;
  error?: string | null;
  isInterviewCompleted?: boolean;
}

/**
 * ChatInput - Message composition area
 *
 * Features:
 * - Text input field
 * - Mic button (placeholder for voice recording)
 * - Send button
 * - Error display
 * - Disabled state when sending or interview complete
 *
 * Note: Does not call API directly.
 * Delegates to parent via onSendMessage callback.
 */
export function ChatInput({
  onSendMessage,
  isSending = false,
  error,
  isInterviewCompleted = false,
  
}: ChatInputProps) {
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (input.trim()) {
      onSendMessage(input);
      setInput('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && !isSending) {
      e.preventDefault();
      handleSend();
    }
  };

  const isDisabled = isSending || isInterviewCompleted;

  return (
    <div className="px-6 py-4 border-t border-gray-200 bg-white">
      {error && (
        <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="flex items-center gap-3">
        {/* Mic button */}
        <button
          disabled={isDisabled}
          className="p-2 rounded-full hover:bg-gray-100 text-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Record message"
        >
          <Mic className="w-5 h-5" />
        </button>

        {/* Input field */}
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={isDisabled}
          placeholder={isInterviewCompleted ? 'Interview completed' : 'Explain your design...'}
          className="flex-1 px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:border-gray-400 text-sm bg-white placeholder-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
        />

        {/* Send button */}
        <button
          onClick={handleSend}
          disabled={isDisabled || !input.trim()}
          className={`p-3 rounded-full transition-colors ${
            isDisabled || !input.trim()
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-green-600 text-white hover:bg-green-700'
          }`}
          aria-label="Send message"
        >
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
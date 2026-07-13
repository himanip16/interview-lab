// components/interview/live/Message.tsx
import React from 'react';
import { Message as MessageType } from '@/src/features/interview/types/message';

interface MessageProps {
  message: MessageType;
}

const Message: React.FC<MessageProps> = ({ message }) => {
  const isAI = message.role === 'assistant' || message.role === 'system';

  return (
    <div className={`flex ${isAI ? 'justify-start' : 'justify-end'} mb-4`}>
      <div
        className={`max-w-[80%] rounded-xl p-4 ${
          isAI
            ? 'bg-muted text-foreground border border-border shadow-sm'
            : 'bg-primary text-primary-foreground shadow-md'
        }`}
      >
        <div className="text-xs mb-1 opacity-70 font-semibold uppercase">
          {isAI ? 'Interviewer' : 'You'}
        </div>
        <div className="whitespace-pre-wrap leading-relaxed text-sm">
          {message.content}
        </div>
      </div>
    </div>
  );
};

export default Message;
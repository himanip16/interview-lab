// components/interview/live/MessageList.tsx
import React from 'react';
import { TranscriptMessage } from '../../types/TranscriptMessage';
import Message from './Message';

interface MessageListProps {
  messages: TranscriptMessage[];
}

const MessageList: React.FC<MessageListProps> = ({ messages }) => {
  return (
    <div className="space-y-4 min-h-full">
      {messages.map((msg, index) => (
        <Message key={index} message={msg} />
      ))}
      
      {messages.length === 0 && (
        <div className="flex items-center justify-center min-h-[200px] text-muted-foreground">
          <p>No messages yet. The interviewer will start shortly.</p>
        </div>
      )}
    </div>
  );
};

export default MessageList;
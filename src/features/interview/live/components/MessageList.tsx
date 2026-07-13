// components/interview/live/MessageList.tsx
import React from 'react';
import { Message as MessageType } from '@/src/features/interview/types/message';
import Message from './Message';

interface MessageListProps {
  messages: MessageType[];
}

const MessageList: React.FC<MessageListProps> = ({ messages }) => {
  return (
    <div className="space-y-4 min-h-full">
      {messages.map((msg, index) => (
        <Message key={msg.id || index} message={msg} />
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
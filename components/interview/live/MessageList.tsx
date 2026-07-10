// components/interview/live/MessageList.tsx
import React, { useEffect, useRef } from 'react';
import { Message as MessageType } from '@/types/message';
import Message from './Message';

interface MessageListProps {
  messages: MessageType[];
}

const MessageList: React.FC<MessageListProps> = ({ messages }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div 
      ref={scrollRef}
      className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50"
    >
      {messages.map((msg, index) => (
        <Message key={msg.id || index} message={msg} />
      ))}
      
      {messages.length === 0 && (
        <div className="flex items-center justify-center h-full text-gray-400">
          <p>No messages yet. The interviewer will start shortly.</p>
        </div>
      )}
    </div>
  );
};

export default MessageList; // This "export" makes it a module
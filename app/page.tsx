"use client";

import { useState } from "react";

import ChatWindow from "@/components/ChatWindow";
import InterviewHeader from "@/components/InterviewHeader";
import MessageInput from "@/components/MessageInput";
import { Message } from "@/types/message";

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Welcome! Today we'll design YouTube. Start by asking clarifying questions.",
    },
  ]);

  function handleSend(content: string) {
  setMessages((previous) => [
    ...previous,
    {
      role: "user",
      content,
    },
  ]);
}

  return (
    <main className="flex h-screen flex-col bg-gray-50">
      <InterviewHeader />

      <ChatWindow messages={messages} />

      <MessageInput onSend={handleSend} />
    </main>
  );
}
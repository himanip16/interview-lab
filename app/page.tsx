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

async function handleSend(content: string) {
  // Create the updated conversation
  const updatedMessages: Message[] = [
    ...messages,
    {
      role: "user",
      content,
    },
  ];

  // Update the UI immediately
  setMessages(updatedMessages);

  // Send the entire conversation to the backend
  const response = await fetch("/api/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messages: updatedMessages,
    }),
  });

  const data = await response.json();

  // Add the AI's response
  setMessages([
    ...updatedMessages,
    {
      role: "assistant",
      content: data.reply,
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
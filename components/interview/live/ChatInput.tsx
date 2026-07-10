// components/interview/live/ChatInput.tsx
"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function ChatInput({ onSend, disabled }: { onSend: (val: string) => void, disabled: boolean }) {
  const [text, setText] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim() && !disabled) {
      onSend(text);
      setText(""); // This clears the box after sending
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 p-4 bg-white border-t">
      <Input
        value={text} // This connects the state to the box
        onChange={(e) => setText(e.target.value)} // This updates state as you type
        placeholder="Type your architectural thoughts..."
        disabled={disabled}
      />
      <Button type="submit" disabled={disabled || !text.trim()}>
        Send
      </Button>
    </form>
  );
}

// components/interview/live/ChatInput.tsx
"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
export default function ChatInput({ onSend, isLoading }: { onSend: (v: string) => void, isLoading: boolean }) {
  const [text, setText] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim() && !isLoading) { // Use isLoading to prevent double-submit
      onSend(text);
      setText("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 p-4 bg-white border-t">
      <Input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type your response..."
        // REMOVE disabled={isLoading} from here
        className="text-black"
      />
      <Button type="submit" disabled={isLoading || !text.trim()}>
        {isLoading ? "..." : "Send"}
      </Button>
    </form>
  );
}




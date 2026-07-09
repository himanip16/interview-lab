"use client";

import { useState } from "react";

type Props = {
  onSend: (message: string) => void;
};

export default function MessageInput({
  onSend,
}: Props) {
  const [text, setText] = useState("");

  function handleSend() {
    if (!text.trim()) return;

    onSend(text);

    setText("");
  }

  return (
    <div className="border-t p-4">
      <div className="flex gap-3">
        <input
          className="flex-1 rounded-lg border px-4 py-3"
          placeholder="Explain your design..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <button
          onClick={handleSend}
          className="rounded-lg bg-blue-600 px-6 text-white"
        >
          Send
        </button>
      </div>
    </div>
  );
}
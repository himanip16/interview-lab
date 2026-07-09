"use client";

import { useState } from "react";

type Props = {
  onSend: (message: string) => Promise<void>;
};

export default function MessageInput({ onSend }: Props) {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSend() {
    if (!text.trim() || loading) return;

    const current = text;

    // Clear immediately
    setText("");
    setLoading(true);

    try {
      await onSend(current);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="border-t p-4">
      <div className="flex gap-3">
        <input
          className="flex-1 rounded-lg border px-4 py-3 text-black"
          placeholder="Explain your design..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={loading}
        />

        <button
          onClick={handleSend}
          disabled={loading}
          className="rounded-lg bg-blue-600 px-6 py-3 text-white disabled:opacity-50"
        >
          {loading ? "Thinking..." : "Send"}
        </button>
      </div>
    </div>
  );
}
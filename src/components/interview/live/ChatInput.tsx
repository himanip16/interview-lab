'use client';

import { useEffect, useRef, useState } from "react";
import {
  Mic,
  MicOff,
  SendHorizontal,
  Loader2,
  CheckCircle2,
} from "lucide-react";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
}

type RecordingStatus =
  | "idle"
  | "recording"
  | "transcribing"
  | "success";

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export default function ChatInput({
  onSendMessage,
  disabled = false,
}: ChatInputProps) {
  const [message, setMessage] = useState("");
  const [status, setStatus] =
    useState<RecordingStatus>("idle");

  const recognitionRef = useRef<any>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const isEmpty = message.trim().length === 0;

  useEffect(() => {
    if (status !== "success") return;

    const timer = setTimeout(() => {
      setStatus("idle");
    }, 2500);

    return () => clearTimeout(timer);
  }, [status]);

  useEffect(() => {
    return () => {
      recognitionRef.current?.stop?.();
    };
  }, []);

  useEffect(() => {
    const textarea = textareaRef.current;

    if (!textarea) return;

    textarea.style.height = "0px";
    textarea.style.height = `${textarea.scrollHeight}px`;
  }, [message]);

  const handleSend = () => {
    const text = message.trim();

    if (!text || disabled) return;

    onSendMessage(text);

    setMessage("");
    setStatus("idle");
  };

  const toggleListening = () => {
    if (disabled || status === "transcribing") return;

    if (status === "recording") {
      recognitionRef.current?.stop();
      return;
    }

    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.error(
        "Speech Recognition is not supported in this browser."
      );
      return;
    }

    const recognition = new SpeechRecognition();

    recognitionRef.current = recognition;

    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.onstart = () => {
      setStatus("recording");
    };

    recognition.onresult = (event: any) => {
      setStatus("transcribing");

      const transcript =
        event.results[0][0].transcript ?? "";

      setMessage(transcript);

      setStatus("success");
    };

    recognition.onerror = (event: any) => {
  console.log("SpeechRecognition:", event.error);

  switch (event.error) {
    case "no-speech":
      // User clicked record but didn't say anything.
      break;

    case "audio-capture":
      console.error("No microphone detected.");
      break;

    case "not-allowed":
      console.error("Microphone permission denied.");
      break;

    case "network":
      console.error("Speech recognition network error.");
      break;

    default:
      console.error(event.error);
  }

  setStatus("idle");
};

    recognition.onend = () => {
      setStatus((current) =>
        current === "recording" ? "idle" : current
      );
    };

    recognition.start();
  };

  return (
    <div className="border-t bg-white p-4">
      <div className="mb-2 flex h-6 items-center px-2">
        {status === "recording" && (
          <div className="flex items-center gap-2 text-sm font-medium text-red-600">
            <div className="h-2 w-2 animate-pulse rounded-full bg-red-600" />
            Recording... Click again to stop.
          </div>
        )}

        {status === "transcribing" && (
          <div className="flex items-center gap-2 text-sm text-blue-600">
            <Loader2
              size={14}
              className="animate-spin"
            />
            Transcribing...
          </div>
        )}

        {status === "success" && (
          <div className="flex items-center gap-2 text-sm text-green-600">
            <CheckCircle2 size={14} />
            Transcript ready. Review and press Send.
          </div>
        )}
      </div>

      <div className="flex items-end gap-3">
        <button
          type="button"
          onClick={toggleListening}
          disabled={
            disabled || status === "transcribing"
          }
          className={`flex items-center gap-2 rounded-full border px-4 py-2 transition ${
            status === "recording"
              ? "border-red-300 bg-red-50 text-red-600"
              : "border-slate-300 bg-white hover:bg-slate-50"
          } disabled:cursor-not-allowed disabled:opacity-50`}
        >
          {status === "recording" ? (
            <>
              <MicOff size={18} />
              Stop
            </>
          ) : (
            <>
              <Mic size={18} />
              Record
            </>
          )}
        </button>

        <textarea
          ref={textareaRef}
          rows={1}
          value={message}
          disabled={disabled}
          placeholder={
            disabled
              ? "AI is thinking..."
              : "Explain your design..."
          }
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (
              e.key === "Enter" &&
              !e.shiftKey
            ) {
              e.preventDefault();
              handleSend();
            }
          }}
          className="max-h-40 min-h-[44px] flex-1 resize-none rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100"
        />

        <button
          type="button"
          onClick={handleSend}
          disabled={disabled || isEmpty}
          className="flex items-center gap-2 rounded-full bg-blue-600 px-5 py-3 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          Send
          <SendHorizontal size={18} />
        </button>
      </div>
    </div>
  );
}
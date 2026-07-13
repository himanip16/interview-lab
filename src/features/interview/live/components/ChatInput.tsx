'use client';

import { useCallback, useEffect, useRef, useState } from "react";
import {
  Mic,
  MicOff,
  SendHorizontal,
  Loader2,
  CheckCircle2,
} from "lucide-react";

const SUCCESS_TIMEOUT_MS = 2500;
const DEFAULT_LANGUAGE = "en-US";
const TEXTArea_MIN_HEIGHT = 44;

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
}

type RecordingStatus =
  | "idle"
  | "recording"
  | "processing"
  | "success"
  | "error"
  | "unsupported"
  | "permissionDenied";

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognitionResult {
  length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
  isFinal: boolean;
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: "no-speech" | "audio-capture" | "not-allowed" | "network" | "aborted" | "language-not-supported" | "service-not-allowed";
  message: string;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  grammars?: any;
  interimResults: boolean;
  lang: string;
  maxAlternatives: number;
  serviceURI: string;

  onstart: ((this: SpeechRecognition, ev: Event) => any) | null;
  onend: ((this: SpeechRecognition, ev: Event) => any) | null;
  onerror: ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => any) | null;
  onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null;
  onnomatch: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null;
  onsoundstart: ((this: SpeechRecognition, ev: Event) => any) | null;
  onsoundend: ((this: SpeechRecognition, ev: Event) => any) | null;
  onspeechstart: ((this: SpeechRecognition, ev: Event) => any) | null;
  onspeechend: ((this: SpeechRecognition, ev: Event) => any) | null;

  start(): void;
  stop(): void;
  abort(): void;
}

interface SpeechRecognitionConstructor {
  prototype: SpeechRecognition;
  new (): SpeechRecognition;
}

declare global {
  interface Window {
    SpeechRecognition: SpeechRecognitionConstructor | undefined;
    webkitSpeechRecognition: SpeechRecognitionConstructor | undefined;
  }
}

export default function ChatInput({
  onSendMessage,
  disabled = false,
}: ChatInputProps) {
  const [message, setMessage] = useState("");
  const [status, setStatus] =
    useState<RecordingStatus>("idle");

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const recognitionIdRef = useRef(0);

  const speechSupported =
    typeof window !== "undefined" &&
    ("SpeechRecognition" in window ||
     "webkitSpeechRecognition" in window);

  const isEmpty = message.trim().length === 0;

  useEffect(() => {
    if (status !== "success") return;

    const timer = setTimeout(() => {
      setStatus("idle");
    }, SUCCESS_TIMEOUT_MS);

    return () => clearTimeout(timer);
  }, [status]);

  useEffect(() => {
    if (!speechSupported) {
      setStatus("unsupported");
      return;
    }

    const SpeechRecognitionConstructor =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    if (!SpeechRecognitionConstructor) {
      setStatus("unsupported");
      return;
    }

    const recognition = new SpeechRecognitionConstructor();
    const currentId = ++recognitionIdRef.current;

    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = DEFAULT_LANGUAGE;

    recognition.onstart = () => {
      if (recognitionIdRef.current !== currentId) return;
      setStatus("recording");
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      if (recognitionIdRef.current !== currentId) return;
      setStatus("processing");

      const transcript =
        event.results[0][0].transcript ?? "";

      setMessage(transcript);

      // Small delay to ensure processing state is visible
      setTimeout(() => {
        if (recognitionIdRef.current === currentId) {
          setStatus("success");
        }
      }, 100);
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      if (recognitionIdRef.current !== currentId) return;
      switch (event.error) {
        case "no-speech":
          // User clicked record but didn't say anything.
          break;

        case "not-allowed":
          setStatus("permissionDenied");
          break;

        case "audio-capture":
        case "network":
        default:
          setStatus("error");
      }
    };

    recognition.onend = () => {
      if (recognitionIdRef.current !== currentId) return;
      setStatus((current) =>
        current === "recording" ? "idle" : current
      );
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.stop();
    };
  }, []);

  useEffect(() => {
    const textarea = textareaRef.current;

    if (!textarea) return;

    textarea.style.height = "0px";
    textarea.style.height = `${textarea.scrollHeight}px`;
  }, [message]);

  const handleSend = useCallback(() => {
    const text = message.trim();

    if (!text || disabled) return;

    onSendMessage(text);

    setMessage("");
    setStatus("idle");
  }, [message, disabled, onSendMessage]);

  const toggleListening = useCallback(() => {
    if (disabled || !speechSupported) return;

    if (status === "error" || status === "permissionDenied") {
      setStatus("idle");
      return;
    }

    if (status === "processing") return;

    if (!recognitionRef.current) {
      return;
    }

    if (status === "recording") {
      recognitionRef.current.stop();
      return;
    }

    recognitionRef.current.start();
  }, [disabled, speechSupported, status]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }, [handleSend]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
  }, []);

  return (
    <div className="border-t border-border bg-card p-6">
      <div
        className="mb-3 flex h-6 items-center px-2"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        {status === "recording" && (
          <div className="flex items-center gap-2 text-sm font-medium text-red-600">
            <div className="h-2 w-2 animate-pulse rounded-full bg-red-600" />
            Recording... Click again to stop.
          </div>
        )}

        {status === "processing" && (
          <div className="flex items-center gap-2 text-sm text-primary">
            <Loader2
              size={14}
              className="animate-spin"
            />
            Processing...
          </div>
        )}

        {status === "success" && (
          <div className="flex items-center gap-2 text-sm text-primary">
            <CheckCircle2 size={14} />
            Transcript ready. Review and press Send.
          </div>
        )}

        {status === "error" && (
          <div className="flex items-center gap-2 text-sm text-destructive">
            Recording failed. Please try again.
          </div>
        )}

        {status === "permissionDenied" && (
          <div className="flex items-center gap-2 text-sm text-destructive">
            Microphone access denied. Check browser permissions.
          </div>
        )}

        {status === "unsupported" && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            Speech recognition not supported in this browser.
          </div>
        )}
      </div>

      <div className="flex items-end gap-3">
        <button
          type="button"
          onClick={toggleListening}
          disabled={
            disabled || status === "processing" || !speechSupported
          }
          className={`flex items-center gap-2 rounded-full border px-4 py-2 transition shrink-0 ${
            status === "recording"
              ? "border-red-300 bg-red-50 text-red-600"
              : "border-border bg-background hover:bg-muted"
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
          disabled={disabled || status === "recording"}
          placeholder={
            status === "recording"
              ? "Recording..."
              : disabled
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
          style={{ minHeight: `${TEXTArea_MIN_HEIGHT}px` }}
          className="max-h-40 min-w-[200px] flex-1 resize-none rounded-xl border border-border px-4 py-3 outline-none focus:border-primary focus:ring-2 focus:ring-primary disabled:bg-muted disabled:text-muted-foreground"
        />

        <button
          type="button"
          onClick={handleSend}
          disabled={disabled || isEmpty}
          className="flex items-center gap-2 rounded-full bg-primary px-5 py-3 font-medium text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground shrink-0"
        >
          Send
          <SendHorizontal size={18} />
        </button>
      </div>
    </div>
  );
}
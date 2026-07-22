import type { TranscriptMessage } from "@/features/library/types/transcript";
import { ContentBlockRenderer } from "./ContentBlockRenderer";

const ROLE_CONFIG: Record<string, { label: string; align: "left" | "right"; bubbleBg: string; labelColor: string }> = {
  interviewer: { label: "Interviewer", align: "left", bubbleBg: "#FFFFFF", labelColor: "#3E6BFF" },
  candidate: { label: "Candidate", align: "right", bubbleBg: "#F1EFEA", labelColor: "#00A87E" },
  takeaway: { label: "Takeaway", align: "left", bubbleBg: "rgba(232, 148, 10, 0.06)", labelColor: "#C97800" },
};

function formatTime(seconds?: number) {
  if (seconds === undefined) return null;
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function TranscriptMessageBubble({ message }: { message: TranscriptMessage }) {
  const config = ROLE_CONFIG[message.role] ?? ROLE_CONFIG.interviewer;
  const blocks = typeof message.content === "string"
    ? [{ type: "text" as const, value: message.content }]
    : message.content;

  return (
    <div className={`flex flex-col ${config.align === "right" ? "items-end" : "items-start"}`}>
      <div className="mb-1 flex items-center gap-2 px-1">
        <span className="text-[11.5px] font-semibold sm:text-[12px]" style={{ color: config.labelColor }}>
          {config.label}
        </span>
        {formatTime(message.elapsedSeconds) && (
          <span className="text-[10.5px] sm:text-[11px]" style={{ color: "#9A9BA6" }}>
            {formatTime(message.elapsedSeconds)}
          </span>
        )}
      </div>

      <div
        className="w-full max-w-full space-y-2.5 rounded-2xl border p-3 sm:max-w-[85%] sm:p-4"
        style={{ background: config.bubbleBg, borderColor: "rgba(21,22,28,0.07)" }}
      >
        {blocks.map((block, i) => (
          <ContentBlockRenderer key={block.id ?? i} block={block} />
        ))}
      </div>
    </div>
  );
}
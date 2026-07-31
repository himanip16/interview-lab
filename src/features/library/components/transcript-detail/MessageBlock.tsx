// src/features/library/components/transcript-detail/MessageBlock.tsx

"use client";

import { useState, useMemo, memo } from "react";
import type { ContentBlock, TranscriptMessage, Concept } from "@/features/library/types/transcript";
import { groupBlocks } from "@/features/library/utils/transcript";
import { IntentTag } from "./IntentTag";
import { EvaluationCallout } from "./EvaluationCallout";
import { ConceptReference } from "./ConceptReference";
import { MessageActions } from "./MessageActions";
import { InlineContentRenderer } from "./InlineContentRenderer";
import { MESSAGE_STYLES } from "./styles";

const STATUS_STYLE: Record<string, { bg: string; underline: string; tag: string; tagColor: string; annoBg: string; annoColor: string }> = {
  strong: { bg: "rgba(0,217,163,0.22)", underline: "#00A87E", tag: "Strength", tagColor: "#00A87E", annoBg: "rgba(0,217,163,0.08)", annoColor: "#00A87E" },
  missed: { bg: "rgba(255,90,60,0.16)", underline: "#FF5A3C", tag: "Gap", tagColor: "#C9432B", annoBg: "rgba(255,90,60,0.08)", annoColor: "#C9432B" },
  note: { bg: "rgba(232,148,10,0.18)", underline: "#E8940A", tag: "Note", tagColor: "#C97800", annoBg: "rgba(232,148,10,0.08)", annoColor: "#C97800" },
};

type Props = {
  message: TranscriptMessage;
  isBookmarked: boolean;
  note?: string;
  aiReply?: string;
  concepts?: Record<string, Concept>;
  exploredConcepts: string[];
  onToggleBookmark: (id: string) => void;
  onStartNote: (id: string) => void;
  onSaveNote: (id: string, note: string) => void;
  onDeleteNote: (id: string) => void;
  onAskAI: (id: string, type: "why" | "explain" | "challenge") => void;
  onExploreConcept: (key: string) => void;
  onCollapseAiReply: (id: string) => void;
};

export function InlineHighlight({
  block,
  isOpen,
  onToggle,
}: {
  block: Extract<ContentBlock, { type: "highlight" }>;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const style = STATUS_STYLE[block.status] ?? STATUS_STYLE.note;
  return (
    <span
      role="button"
      tabIndex={0}
      aria-expanded={isOpen}
      aria-label={`Toggle ${block.status} annotation`}
      onClick={onToggle}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onToggle()}
      className="cursor-pointer rounded px-0.5"
      style={{
        background: style.bg,
        borderBottom: `2px solid ${style.underline}`,
        boxDecorationBreak: "clone",
        WebkitBoxDecorationBreak: "clone",
      }}
    >
      {block.value}
    </span>
  );
}

function AnnotationPanel({ block, align }: { block: Extract<ContentBlock, { type: "highlight" }>; align: "left" | "right" }) {
  const style = STATUS_STYLE[block.status] ?? STATUS_STYLE.note;
  return (
    <div
      className={`mt-1 max-w-[78%] rounded-2xl px-4 py-3 text-[12px] leading-relaxed ${
        align === "right" ? "self-end" : "self-start"
      }`}
      style={{ background: style.annoBg, color: style.annoColor }}
    >
      <span className="mr-1.5 text-[9.5px] font-bold uppercase tracking-wide">{style.tag}</span>
      {block.explanation}
    </div>
  );
}

function BlockContent({ block }: { block: ContentBlock }) {
  if (block.type === "code") {
    return (
      <div className="mt-2 overflow-x-auto rounded-lg" style={{ background: MESSAGE_STYLES.codeBlock.background }}>
        <pre className="p-3 text-[12px] leading-relaxed sm:p-4 sm:text-[13px]">
          <code style={{ color: MESSAGE_STYLES.codeBlock.color, fontFamily: MESSAGE_STYLES.codeBlock.fontFamily }}>{block.value}</code>
        </pre>
      </div>
    );
  }
  if (block.type === "whiteboard" || block.type === "animation") {
    return (
      <div className="mt-2 rounded-lg border p-2 sm:p-3" style={{ borderColor: MESSAGE_STYLES.whiteboard.borderColor, background: MESSAGE_STYLES.whiteboard.background }}>
        <div className="w-full [&_svg]:h-auto [&_svg]:w-full" dangerouslySetInnerHTML={{ __html: block.value }} />
        {block.caption && (
          <div className="mt-2 text-center text-[11.5px] sm:text-[12px]" style={{ color: MESSAGE_STYLES.whiteboard.captionColor }}>
            {block.caption}
          </div>
        )}
      </div>
    );
  }
  return null;
}

function NoteCard({ note, onRemove, onCollapse }: { note: string; onRemove: () => void; onCollapse: () => void }) {
  return (
    <div
      className="mt-1.5 max-w-[78%] rounded-[10px] border-l-[3px] px-3 py-2.5 text-[12px]"
      style={{ background: MESSAGE_STYLES.note.background, borderColor: MESSAGE_STYLES.note.borderColor, color: MESSAGE_STYLES.note.color }}
    >
      <div className="flex items-start justify-between gap-2">
        <span className="flex-1">📝 {note}</span>
        <button 
          onClick={onCollapse}
          aria-label="Close note"
          className="text-[10px] font-semibold cursor-pointer"
          style={{ color: MESSAGE_STYLES.note.color, opacity: 0.7 }}
        >
          ✕
        </button>
      </div>
    </div>
  );
}

function NoteInput({ onSave, onCancel }: { onSave: (note: string) => void; onCancel: () => void }) {
  const [value, setValue] = useState("");

  return (
    <div className="mt-1.5 flex max-w-[78%] gap-1.5">
      <input
        type="text"
        placeholder="Remember this caching strategy..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="flex-1 rounded-[9px] border px-2.5 py-2 text-[12px] outline-none"
        style={{ borderColor: "rgba(21,22,28,0.12)" }}
      />
      <button
        onClick={() => onSave(value)}
        className="rounded-[9px] border-none bg-[#15161C] px-3 text-[11px] font-bold text-white cursor-pointer"
      >
        Save
      </button>
    </div>
  );
}

function AIReply({ reply, onCollapse }: { reply: string; onCollapse: () => void }) {
  return (
    <div
      className="mt-1.5 max-w-[78%] rounded-[12px] border px-3 py-2.5 text-[12px]"
      style={{ background: MESSAGE_STYLES.aiReply.background, borderColor: MESSAGE_STYLES.aiReply.borderColor, color: MESSAGE_STYLES.aiReply.color }}
    >
      <div className="flex items-start justify-between gap-2">
        <span className="flex-1"><b style={{ color: MESSAGE_STYLES.aiReply.accentColor }}>AI:</b> {reply}</span>
        <button 
          onClick={onCollapse}
          aria-label="Close AI reply"
          className="text-[10px] font-semibold cursor-pointer"
          style={{ color: MESSAGE_STYLES.aiReply.color, opacity: 0.7 }}
        >
          ✕
        </button>
      </div>
    </div>
  );
}

export function MessageBlock({
  message,
  isBookmarked,
  note,
  aiReply,
  concepts = {},
  exploredConcepts,
  onToggleBookmark,
  onStartNote,
  onSaveNote,
  onDeleteNote,
  onAskAI,
  onExploreConcept,
  onCollapseAiReply,
}: Props) {
  const [openHighlightId, setOpenHighlightId] = useState<string | null>(null);
  const [showNoteInput, setShowNoteInput] = useState(false);

  const getHighlightKey = (item: Extract<ContentBlock, { type: "highlight" }>, index: number) => item.id ?? `highlight-${index}`;
  const toggle = (id: string) => setOpenHighlightId(prev => prev === id ? null : id);

  if (message.role === "takeaway") {
    const text = typeof message.content === "string" ? message.content : message.content.map((b) => (b.type === "text" || b.type === "highlight" ? b.value : "")).join(" ");
    return (
      <div
        className="mx-1 rounded-2xl border-l-[3px] p-4 sm:p-5"
        style={{ background: MESSAGE_STYLES.takeaway.background, borderColor: MESSAGE_STYLES.takeaway.borderColor }}
      >
        <div className="mb-1.5 text-[10.5px] font-bold uppercase tracking-wide" style={{ color: MESSAGE_STYLES.takeaway.textColor }}>
          Takeaway
        </div>
        <p className="text-[13.5px] italic leading-relaxed" style={{ color: "#15161C" }}>
          {text}
        </p>
      </div>
    );
  }

  const isCandidate = message.role === "candidate";
  const messageId = message.id || "";
  const blocks = typeof message.content === "string" ? [{ type: "text" as const, value: message.content }] : message.content;
  const groups = useMemo(() => groupBlocks(blocks), [blocks]);
  const highlights = useMemo(() => blocks.filter((b): b is Extract<ContentBlock, { type: "highlight" }> => b.type === "highlight"), [blocks]);

  return (
    <div className={`relative mb-1.5 flex gap-2.5 items-start ${isCandidate ? "flex-row-reverse" : "flex-row"}`}>
      {/* Avatar */}
      <div
        className="flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white"
        style={{ background: isCandidate ? MESSAGE_STYLES.avatar.candidate : MESSAGE_STYLES.avatar.interviewer }}
      >
        {isCandidate ? "YOU" : "IV"}
      </div>

      <div className="flex max-w-[78%] flex-col">
        {/* Message body */}
        <div className={isCandidate ? "flex flex-col items-end" : "flex flex-col items-start"}>
          {/* Message actions - bookmark/note only */}
          <MessageActions
            messageId={messageId}
            isBookmarked={isBookmarked}
            isCandidate={isCandidate}
            variant="interviewer"
            onToggleBookmark={onToggleBookmark}
            onStartNote={(id) => setShowNoteInput(true)}
            onAskAI={onAskAI}
          />

          {/* Testing button for interviewer messages - above bubble */}
          {!isCandidate && message.intent && (
            <button
              className="mb-1.5 rounded-full border px-2.5 py-1 text-[10.5px] font-semibold cursor-pointer"
              style={{ color: MESSAGE_STYLES.testingButton.color, background: MESSAGE_STYLES.testingButton.background, borderColor: MESSAGE_STYLES.testingButton.borderColor }}
            >
              📍 Testing: {message.intent}
            </button>
          )}

          {/* Bubble */}
          <div
            className="rounded-[16px] px-4 py-3 text-[13.5px] leading-relaxed"
            style={{
              background: isCandidate ? MESSAGE_STYLES.bubble.candidate.background : MESSAGE_STYLES.bubble.interviewer.background,
              border: isCandidate ? "none" : MESSAGE_STYLES.bubble.interviewer.border,
              borderTopRightRadius: isCandidate ? "4px" : "16px",
              borderTopLeftRadius: isCandidate ? "16px" : "4px",
              color: MESSAGE_STYLES.bubble.candidate.color,
            }}
          >
            {groups.map((group, gi) =>
              group.kind === "inline" ? (
                <InlineContentRenderer
                  key={gi}
                  items={group.items}
                  concepts={concepts}
                  onExploreConcept={onExploreConcept}
                  openHighlightId={openHighlightId}
                  onToggleHighlight={toggle}
                />
              ) : (
                <BlockContent key={gi} block={group.block} />
              )
            )}
          </div>

          {/* Ask AI buttons for candidate messages */}
          {isCandidate && (
            <MessageActions
              messageId={messageId}
              isBookmarked={isBookmarked}
              isCandidate={isCandidate}
              variant="candidate"
              onToggleBookmark={onToggleBookmark}
              onStartNote={(id) => setShowNoteInput(true)}
              onAskAI={onAskAI}
            />
          )}
        </div>

        {/* Note slot */}
        {note && !showNoteInput && <NoteCard note={note} onRemove={() => onDeleteNote(messageId)} onCollapse={() => onDeleteNote(messageId)} />}
        {showNoteInput && (
          <NoteInput
            onSave={(newNote) => {
              onSaveNote(messageId, newNote);
              setShowNoteInput(false);
            }}
            onCancel={() => setShowNoteInput(false)}
          />
        )}

        {/* AI reply slot */}
        {aiReply && <AIReply reply={aiReply} onCollapse={() => onCollapseAiReply(messageId)} />}

        {/* Highlight annotations */}
        {highlights.map((h, hi) =>
          openHighlightId === getHighlightKey(h, hi) ? <AnnotationPanel key={h.id ?? hi} block={h} align={isCandidate ? "right" : "left"} /> : null
        )}
      </div>

      {/* Evaluation callout */}
      {message.eval && <EvaluationCallout eval={message.eval} />}
    </div>
  );
}

export default memo(MessageBlock);
// src/features/library/components/transcript-detail/MessageBlock.tsx

"use client";

import { useState } from "react";
import type { ContentBlock, TranscriptMessage, Concept } from "@/features/library/types/transcript";
import { IntentTag } from "./IntentTag";
import { EvaluationCallout } from "./EvaluationCallout";
import { ConceptReference } from "./ConceptReference";
import { MessageActions } from "./MessageActions";

const STATUS_STYLE: Record<string, { bg: string; underline: string; tag: string; tagColor: string; annoBg: string; annoColor: string }> = {
  strong: { bg: "rgba(0,217,163,0.22)", underline: "#00A87E", tag: "Strength", tagColor: "#00A87E", annoBg: "rgba(0,217,163,0.08)", annoColor: "#00A87E" },
  missed: { bg: "rgba(255,90,60,0.16)", underline: "#FF5A3C", tag: "Gap", tagColor: "#C9432B", annoBg: "rgba(255,90,60,0.08)", annoColor: "#C9432B" },
  note: { bg: "rgba(232,148,10,0.18)", underline: "#E8940A", tag: "Note", tagColor: "#C97800", annoBg: "rgba(232,148,10,0.08)", annoColor: "#C97800" },
};

type Group =
  | { kind: "inline"; items: ContentBlock[] }
  | { kind: "block"; block: ContentBlock };

type Props = {
  message: TranscriptMessage;
  isBookmarked: boolean;
  note?: string;
  aiReply?: string;
  concepts?: Record<string, Concept>;
  exploredConcepts: string[];
  onToggleBookmark: (id: string) => void;
  onAddNote: (id: string, note: string) => void;
  onAskAI: (id: string, type: "why" | "explain" | "challenge") => void;
  onExploreConcept: (key: string) => void;
  onCollapseAiReply: (id: string) => void;
};

function groupBlocks(blocks: ContentBlock[]): Group[] {
  const groups: Group[] = [];
  for (const block of blocks) {
    if (block.type === "text" || block.type === "highlight" || block.type === "concept") {
      const last = groups[groups.length - 1];
      if (last && last.kind === "inline") {
        last.items.push(block);
      } else {
        groups.push({ kind: "inline", items: [block] });
      }
    } else {
      groups.push({ kind: "block", block });
    }
  }
  return groups;
}

function InlineHighlight({
  block,
  open,
  onToggle,
}: {
  block: Extract<ContentBlock, { type: "highlight" }>;
  open: boolean;
  onToggle: () => void;
}) {
  const style = STATUS_STYLE[block.status] ?? STATUS_STYLE.note;
  return (
    <span
      role="button"
      tabIndex={0}
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
      <div className="mt-2 overflow-x-auto rounded-lg" style={{ background: "#15161C" }}>
        <pre className="p-3 text-[12px] leading-relaxed sm:p-4 sm:text-[13px]">
          <code style={{ color: "#F3F2EE", fontFamily: "'JetBrains Mono', monospace" }}>{block.value}</code>
        </pre>
      </div>
    );
  }
  if (block.type === "whiteboard" || block.type === "animation") {
    return (
      <div className="mt-2 rounded-lg border p-2 sm:p-3" style={{ borderColor: "rgba(21,22,28,0.08)", background: "#fff" }}>
        <div className="w-full [&_svg]:h-auto [&_svg]:w-full" dangerouslySetInnerHTML={{ __html: block.value }} />
        {block.caption && (
          <div className="mt-2 text-center text-[11.5px] sm:text-[12px]" style={{ color: "#5A5B66" }}>
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
      style={{ background: "#FFF8E1", borderColor: "#E8940A", color: "#7A5C00" }}
    >
      <div className="flex items-start justify-between gap-2">
        <span className="flex-1">📝 {note}</span>
        <button 
          onClick={onCollapse}
          className="text-[10px] font-semibold cursor-pointer"
          style={{ color: "#7A5C00", opacity: 0.7 }}
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
      style={{ background: "rgba(106,90,224,0.06)", borderColor: "rgba(106,90,224,0.15)", color: "#5A5B66" }}
    >
      <div className="flex items-start justify-between gap-2">
        <span className="flex-1"><b style={{ color: "#6A5AE0" }}>AI:</b> {reply}</span>
        <button 
          onClick={onCollapse}
          className="text-[10px] font-semibold cursor-pointer"
          style={{ color: "#5A5B66", opacity: 0.7 }}
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
  onAddNote,
  onAskAI,
  onExploreConcept,
  onCollapseAiReply,
}: Props) {
  const [openIds, setOpenIds] = useState<Record<string, boolean>>({});
  const [showNoteInput, setShowNoteInput] = useState(false);

  const toggle = (id: string) => setOpenIds((prev) => ({ ...prev, [id]: !prev[id] }));

  if (message.role === "takeaway") {
    const text = typeof message.content === "string" ? message.content : message.content.map((b) => (b.type === "text" || b.type === "highlight" ? b.value : "")).join(" ");
    return (
      <div
        className="mx-1 rounded-2xl border-l-[3px] p-4 sm:p-5"
        style={{ background: "linear-gradient(160deg,#fff,#FAF9F6)", borderColor: "#00A87E" }}
      >
        <div className="mb-1.5 text-[10.5px] font-bold uppercase tracking-wide" style={{ color: "#00A87E" }}>
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
  const groups = groupBlocks(blocks);
  const highlights = blocks.filter((b): b is Extract<ContentBlock, { type: "highlight" }> => b.type === "highlight");

  return (
    <div className={`relative mb-1.5 flex gap-2.5 items-start ${isCandidate ? "flex-row-reverse" : "flex-row"}`}>
      {/* Avatar */}
      <div
        className="flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white"
        style={{ background: isCandidate ? "#6A5AE0" : "#15161C" }}
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
            showBookmarkNote={true}
            showAskAI={false}
            onToggleBookmark={onToggleBookmark}
            onAddNote={(id) => setShowNoteInput(true)}
            onAskAI={onAskAI}
          />

          {/* Testing button for interviewer messages - above bubble */}
          {!isCandidate && message.intent && (
            <button
              className="mb-1.5 rounded-full border px-2.5 py-1 text-[10.5px] font-semibold cursor-pointer"
              style={{ color: "#E8940A", background: "rgba(232,148,10,0.1)", borderColor: "rgba(232,148,10,0.3)" }}
            >
              📍 Testing: {message.intent}
            </button>
          )}

          {/* Bubble */}
          <div
            className="rounded-[16px] px-4 py-3 text-[13.5px] leading-relaxed"
            style={{
              background: isCandidate ? "#F1EFEA" : "#fff",
              border: isCandidate ? "none" : "1px solid rgba(21,22,28,0.07)",
              borderTopRightRadius: isCandidate ? "4px" : "16px",
              borderTopLeftRadius: isCandidate ? "16px" : "4px",
              color: "#15161C",
            }}
          >
            {groups.map((group, gi) =>
              group.kind === "inline" ? (
                <p key={gi} className="whitespace-pre-wrap">
                  {group.items.map((item, ii) => {
                    if (item.type === "highlight") {
                      return (
                        <InlineHighlight key={item.id ?? ii} block={item} open={!!openIds[item.id ?? ""]} onToggle={() => toggle(item.id ?? String(ii))} />
                      );
                    }
                    if (item.type === "concept" && concepts[item.conceptKey]) {
                      return (
                        <ConceptReference
                          key={ii}
                          value={item.value}
                          conceptKey={item.conceptKey}
                          concept={concepts[item.conceptKey]}
                          onExplore={onExploreConcept}
                        />
                      );
                    }
                    return <span key={ii}>{item.value}</span>;
                  })}
                </p>
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
              showBookmarkNote={false}
              showAskAI={true}
              onToggleBookmark={onToggleBookmark}
              onAddNote={(id) => setShowNoteInput(true)}
              onAskAI={onAskAI}
            />
          )}
        </div>

        {/* Note slot */}
        {note && !showNoteInput && <NoteCard note={note} onRemove={() => onAddNote(messageId, "")} onCollapse={() => onAddNote(messageId, "")} />}
        {showNoteInput && (
          <NoteInput
            onSave={(newNote) => {
              onAddNote(messageId, newNote);
              setShowNoteInput(false);
            }}
            onCancel={() => setShowNoteInput(false)}
          />
        )}

        {/* AI reply slot */}
        {aiReply && <AIReply reply={aiReply} onCollapse={() => onCollapseAiReply(messageId)} />}

        {/* Highlight annotations */}
        {highlights.map((h) =>
          openIds[h.id ?? ""] ? <AnnotationPanel key={h.id} block={h} align={isCandidate ? "right" : "left"} /> : null
        )}
      </div>

      {/* Evaluation callout */}
      {message.eval && <EvaluationCallout eval={message.eval} />}
    </div>
  );
}
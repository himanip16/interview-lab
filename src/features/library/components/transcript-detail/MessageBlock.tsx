"use client";

import { useState } from "react";
import type { ContentBlock, TranscriptMessage } from "@/features/library/types/transcript";

const STATUS_STYLE: Record<string, { bg: string; underline: string; tag: string; tagColor: string; annoBg: string; annoColor: string }> = {
  strong: { bg: "rgba(0,217,163,0.22)", underline: "#00A87E", tag: "Strength", tagColor: "#00A87E", annoBg: "rgba(0,217,163,0.08)", annoColor: "#00A87E" },
  missed: { bg: "rgba(255,90,60,0.16)", underline: "#FF5A3C", tag: "Gap", tagColor: "#C9432B", annoBg: "rgba(255,90,60,0.08)", annoColor: "#C9432B" },
  note: { bg: "rgba(232,148,10,0.18)", underline: "#E8940A", tag: "Note", tagColor: "#C97800", annoBg: "rgba(232,148,10,0.08)", annoColor: "#C97800" },
};

type Group =
  | { kind: "inline"; items: ContentBlock[] }
  | { kind: "block"; block: ContentBlock };

function groupBlocks(blocks: ContentBlock[]): Group[] {
  const groups: Group[] = [];
  for (const block of blocks) {
    if (block.type === "text" || block.type === "highlight") {
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
      className={`mt-1 max-w-[92%] rounded-2xl px-4 py-3 text-[12px] leading-relaxed sm:max-w-[88%] ${
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

export function MessageBlock({ message }: { message: TranscriptMessage }) {
  const [openIds, setOpenIds] = useState<Record<string, boolean>>({});

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
  const align: "left" | "right" = isCandidate ? "right" : "left";
  const blocks = typeof message.content === "string" ? [{ type: "text" as const, value: message.content }] : message.content;
  const groups = groupBlocks(blocks);
  const highlights = blocks.filter((b): b is Extract<ContentBlock, { type: "highlight" }> => b.type === "highlight");

  return (
    <div className={`flex max-w-[92%] flex-col gap-1 sm:max-w-[88%] ${align === "right" ? "self-end items-end" : "self-start items-start"}`}>
      <div className="px-1 text-[11px] font-semibold" style={{ color: "#5A5B66" }}>
        {isCandidate ? "Candidate" : "Interviewer"}
      </div>

      <div
        className="rounded-[20px] px-4 py-3.5 text-[14px] leading-relaxed sm:px-[18px] sm:py-[15px]"
        style={{
          background: isCandidate ? "#F1EFEA" : "#fff",
          border: isCandidate ? "none" : "1px solid rgba(21,22,28,0.07)",
          borderBottomRightRadius: isCandidate ? "6px" : undefined,
          borderBottomLeftRadius: isCandidate ? undefined : "6px",
          color: "#15161C",
        }}
      >
        {groups.map((group, gi) =>
          group.kind === "inline" ? (
            <p key={gi} className="whitespace-pre-wrap">
              {group.items.map((item, ii) =>
                item.type === "highlight" ? (
                  <InlineHighlight key={item.id ?? ii} block={item} open={!!openIds[item.id ?? ""]} onToggle={() => toggle(item.id ?? String(ii))} />
                ) : (
                  <span key={ii}>{item.value}</span>
                )
              )}
            </p>
          ) : (
            <BlockContent key={gi} block={group.block} />
          )
        )}
      </div>

      {highlights.map((h) =>
        openIds[h.id ?? ""] ? <AnnotationPanel key={h.id} block={h} align={align} /> : null
      )}
    </div>
  );
}
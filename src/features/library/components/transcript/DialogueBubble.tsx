// src/features/library/components/transcript/DialogueBubble.tsx
"use client";

import { type ContentBlock } from "../../types/transcript";
import Highlight from "./Highlight";

type Props = {
  role: "interviewer" | "candidate" | "takeaway";
  content: ContentBlock[] | string;
  elapsedSeconds?: number;
  onHighlightClick?: (highlightId: string) => void;
  activeHighlightId?: string | null;
};

export default function DialogueBubble({
  role,
  content,
  elapsedSeconds,
  onHighlightClick,
  activeHighlightId,
}: Props) {
  const isInterviewer = role === "interviewer";
  const isTakeaway = role === "takeaway";

  function formatTimestamp(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remaining = Math.floor(seconds % 60);
    return `${minutes.toString().padStart(2, "0")}:${remaining
      .toString()
      .padStart(2, "0")}`;
  }

  function renderContent(contentBlock: ContentBlock | string): React.ReactNode {
    if (typeof contentBlock === "string") {
      return <span>{contentBlock}</span>;
    }

    if (contentBlock.type === "text") {
      return <span>{contentBlock.value}</span>;
    }

    if (contentBlock.type === "highlight") {
      const isActive = activeHighlightId === contentBlock.id;
      
      return (
        <Highlight
          highlight={contentBlock}
          onClick={onHighlightClick || (() => {})}
          isActive={isActive}
        />
      );
    }

    return <span>{String(contentBlock)}</span>;
  }

  function renderContentBlocks(blocks: ContentBlock[] | string): React.ReactNode {
    if (typeof blocks === "string") {
      return <span key="text">{blocks}</span>;
    }

    return blocks.map((block, index) => (
      <span key={index}>{renderContent(block)}</span>
    ));
  }

  if (isTakeaway) {
    return (
      <div className="border-l-4 border-emerald-500 bg-emerald-50/30 p-6 my-8 rounded-r-xl">
        <span className="text-xs font-bold text-emerald-600 uppercase mb-2 block">
          Takeaway
        </span>
        <p className="text-gray-700 font-medium italic leading-relaxed">
          {typeof content === "string" ? content : renderContentBlocks(content)}
        </p>
      </div>
    );
  }

  return (
    <div className={`mb-8 ${isInterviewer ? "max-w-xl" : "max-w-2xl ml-auto"}`}>
      <div className={`mb-2 flex items-baseline ${isInterviewer ? "justify-start" : "justify-end"}`}>
        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
          {role === "interviewer" ? "Interviewer" : "Candidate"}
        </span>
        {elapsedSeconds !== undefined && (
          <span className={`font-mono text-[10px] text-muted-foreground ${isInterviewer ? "ml-3" : "mr-3"}`}>
            {formatTimestamp(elapsedSeconds)}
          </span>
        )}
      </div>
      <div
        className={`p-6 rounded-2xl leading-relaxed ${
          isInterviewer
            ? "bg-transparent border border-gray-100"
            : "bg-white shadow-sm border border-gray-200"
        }`}
      >
        <p className="text-gray-800">
          {renderContentBlocks(content)}
        </p>
      </div>
    </div>
  );
}

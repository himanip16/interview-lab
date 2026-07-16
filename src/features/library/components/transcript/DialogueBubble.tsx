// src/features/library/components/transcript/DialogueBubble.tsx
import { type ContentBlock } from "../../types/transcript";
import Highlight from "./Highlight";
import TakeawayCard from "./TakeawayCard";

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

    // This should never happen if types are correct, but provides runtime safety
    throw new Error(`Unknown content block type`);
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
    return <TakeawayCard content={content} />;
  }

  return (
    <div className={`mb-10 ${isInterviewer ? "max-w-xl" : "max-w-2xl ml-auto"}`}>
      <div className={`mb-3 flex items-baseline ${isInterviewer ? "justify-start" : "justify-end"}`}>
        <span className={`text-xs uppercase tracking-wider ${
          isInterviewer 
            ? "font-normal text-gray-400" 
            : "font-semibold text-gray-600"
        }`}>
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
        <p className={`text-gray-800 ${isInterviewer ? "font-normal" : "font-medium"}`}>
          {renderContentBlocks(content)}
        </p>
      </div>
    </div>
  );
}

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

  const textClass = `text-gray-800 ${isInterviewer ? "font-normal" : "font-medium"}`;

  // Sanitize HTML to remove script tags and their content
  // This prevents React hydration warnings and security risks
  function sanitizeHtml(html: string): string {
    return html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  }

  function formatTimestamp(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remaining = Math.floor(seconds % 60);
    return `${minutes.toString().padStart(2, "0")}:${remaining
      .toString()
      .padStart(2, "0")}`;
  }

  // Inline blocks: safe to live inside a <p>, rendered as <span>/<Highlight>.
  function renderInline(contentBlock: ContentBlock, key: number): React.ReactNode {
    if (contentBlock.type === "text") {
      return <span key={key}>{contentBlock.value}</span>;
    }

    if (contentBlock.type === "highlight") {
      const isActive = activeHighlightId === contentBlock.id;

      return (
        <Highlight
          key={key}
          highlight={contentBlock}
          onClick={onHighlightClick || (() => {})}
          isActive={isActive}
        />
      );
    }

    return null;
  }

  // Block-level blocks: must NOT be nested inside a <p>, rendered as siblings.
  function renderBlock(contentBlock: ContentBlock, key: number): React.ReactNode {
    if (contentBlock.type === "code") {
      return (
        <div key={key} className="overflow-hidden rounded-lg bg-slate-900">
          {contentBlock.language && (
            <div className="border-b border-slate-700 px-4 py-1.5 font-mono text-[10px] uppercase tracking-wider text-slate-400">
              {contentBlock.language}
            </div>
          )}
          <pre className="overflow-x-auto p-4">
            <code className="text-sm text-slate-100">{contentBlock.value}</code>
          </pre>
        </div>
      );
    }

    if (contentBlock.type === "whiteboard" || contentBlock.type === "animation") {
      return (
        <div key={key} className="rounded-lg border border-gray-200 bg-white p-3">
          <div dangerouslySetInnerHTML={{ __html: sanitizeHtml(contentBlock.value) }} />
          {contentBlock.caption && (
            <div className="mt-2 text-sm text-muted-foreground">
              {contentBlock.caption}
            </div>
          )}
        </div>
      );
    }

    // Gracefully handle unknown content types (e.g., annotation, footnote)
    // This allows content to evolve without breaking the renderer
    return null;
  }

  function renderContentBlocks(blocks: ContentBlock[] | string): React.ReactNode {
    if (typeof blocks === "string") {
      return <p className={textClass}>{blocks}</p>;
    }

    // Consecutive text/highlight blocks are grouped into one <p>.
    // code/whiteboard/animation blocks are flushed out as their own sibling elements.
    const nodes: React.ReactNode[] = [];
    let inlineBuffer: ContentBlock[] = [];

    function flushInline(key: string) {
      if (inlineBuffer.length === 0) return;
      nodes.push(
        <p key={key} className={textClass}>
          {inlineBuffer.map((b, i) => renderInline(b, i))}
        </p>
      );
      inlineBuffer = [];
    }

    blocks.forEach((block, index) => {
      if (block.type === "text" || block.type === "highlight") {
        inlineBuffer.push(block);
      } else {
        flushInline(`p-${index}`);
        nodes.push(renderBlock(block, index));
      }
    });

    flushInline("p-final");

    return nodes;
  }

  if (isTakeaway) {
    return <TakeawayCard content={content} />;
  }

  return (
    <div className={`mb-10 ${isInterviewer ? "max-w-xl" : "max-w-2xl ml-auto"}`}>
      <div className={`mb-3 flex items-baseline ${isInterviewer ? "justify-start" : "justify-end"}`}>
        <span
          className={`text-xs uppercase tracking-wider ${
            isInterviewer
              ? "font-normal text-gray-400"
              : "font-semibold text-gray-600"
          }`}
        >
          {role === "interviewer" ? "Interviewer" : "Candidate"}
        </span>
        {elapsedSeconds !== undefined && (
          <span
            className={`font-mono text-[10px] text-muted-foreground ${
              isInterviewer ? "ml-3" : "mr-3"
            }`}
          >
            {formatTimestamp(elapsedSeconds)}
          </span>
        )}
      </div>
      <div
        className={`space-y-3 rounded-2xl p-6 leading-relaxed ${
          isInterviewer
            ? "bg-transparent border border-gray-100"
            : "bg-white shadow-sm border border-gray-200"
        }`}
      >
        {renderContentBlocks(content)}
      </div>
    </div>
  );
}
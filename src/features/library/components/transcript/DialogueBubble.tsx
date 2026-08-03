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

  const textClass = `${isInterviewer ? "font-normal" : "font-medium"}`;

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
      return <span key={key} style={{ color: 'var(--ink)' }}>{contentBlock.value}</span>;
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
        <div key={key} className="px-[18px] py-[16px] rounded-[14px] font-['JetBrains Mono'] text-[11.5px] leading-[1.75] overflow-x-auto max-w-[82%] self-start" style={{ backgroundColor: 'var(--ink)', color: '#B8F5E3' }}>
          <code>{contentBlock.value}</code>
        </div>
      );
    }

    if (contentBlock.type === "whiteboard" || contentBlock.type === "animation") {
      return (
        <div key={key} className="rounded-lg border p-3 shadow-sm" style={{ borderColor: 'rgba(21,22,28,0.07)', backgroundColor: '#fff' }}>
          <div dangerouslySetInnerHTML={{ __html: sanitizeHtml(contentBlock.value) }} />
          {contentBlock.caption && (
            <div className="mt-2 text-sm" style={{ color: 'var(--ink-soft)' }}>
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
      return <p className={textClass} style={{ color: 'var(--ink)' }}>{blocks}</p>;
    }

    // Consecutive text/highlight blocks are grouped into one <p>.
    // code/whiteboard/animation blocks are flushed out as their own sibling elements.
    const nodes: React.ReactNode[] = [];
    let inlineBuffer: ContentBlock[] = [];

    function flushInline(key: string) {
      if (inlineBuffer.length === 0) return;
      nodes.push(
        <p key={key} className={textClass} style={{ color: 'var(--ink)' }}>
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
    <div className={`flex flex-col gap-[8px] max-w-[82%] ${isInterviewer ? "self-start" : "self-end items-end"}`}>
      <div className={`flex items-center gap-[8px] ${isInterviewer ? "" : "flex-row-reverse"}`}>
        <div className={`w-[26px] h-[26px] rounded-full flex items-center justify-center text-[10px] font-bold text-white font-['Poppins'] flex-shrink-0`} style={{ backgroundColor: isInterviewer ? 'var(--ink)' : 'var(--violet)' }}>
          {isInterviewer ? "IV" : "YOU"}
        </div>
        <span className="text-[11px] font-semibold" style={{ color: 'var(--ink-soft)' }}>
          {role === "interviewer" ? "Interviewer" : "You"}
        </span>
      </div>
      <div
        className={`px-[18px] py-[16px] rounded-[18px] text-[13.5px] relative ${
          isInterviewer ? "rounded-tl-[6px]" : "rounded-tr-[6px]"
        }`}
        style={{
          backgroundColor: isInterviewer ? '#fff' : 'rgba(106,90,224,0.07)',
          border: isInterviewer ? '1px solid rgba(21,22,28,0.07)' : '1px solid rgba(106,90,224,0.15)',
          color: 'var(--ink)',
          lineHeight: '1.7'
        }}
      >
        {renderContentBlocks(content)}
      </div>
    </div>
  );
}
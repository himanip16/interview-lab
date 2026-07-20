"use client";

import Card from "@/shared/ui/Card";
import { type ContentBlock } from "../../types/transcript";

type Props = {
  content: ContentBlock[] | string;
};

export default function TakeawayCard({ content }: Props) {
  function renderContent(contentBlock: ContentBlock | string): React.ReactNode {
    if (typeof contentBlock === "string") {
      return <span>{contentBlock}</span>;
    }

    if (contentBlock.type === "text") {
      return <span>{contentBlock.value}</span>;
    }

    throw new Error(`Unknown content block type: ${contentBlock.type}`);
  }

  function renderContentBlocks(blocks: ContentBlock[] | string): React.ReactNode {
    if (typeof blocks === "string") {
      return <span key="text">{blocks}</span>;
    }

    return blocks.map((block, index) => (
      <span key={index}>{renderContent(block)}</span>
    ));
  }

  return (
    <Card className="border-blue-500/20 bg-blue-500/5 p-5">
      <div className="mb-2 text-xs font-mono uppercase tracking-wider text-blue-400">
        Takeaway
      </div>

      <p className="text-sm leading-7">
        {renderContentBlocks(content)}
      </p>
    </Card>
  );
}
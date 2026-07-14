// src/features/library/components/transcript/TakeawayCard.tsx
"use client";

import { type ContentBlock } from "../../types/transcript";
import { cleanTranscriptText } from "../../utils/textCleaner";

type Props = {
  content: ContentBlock[] | string;
};

function renderContentBlock(block: ContentBlock): React.ReactNode {
  if (block.type === "text") {
    return cleanTranscriptText(block.value);
  }
  if (block.type === "highlight") {
    return cleanTranscriptText(block.value);
  }
  return String(block);
}

export default function TakeawayCard({ content }: Props) {
  return (
    <div className="border-l-4 border-emerald-500 bg-emerald-50/50 p-6 my-8 rounded-r-xl">
      <span className="text-xs font-bold text-emerald-600 uppercase mb-2 block tracking-wider">
        Takeaway
      </span>
      <p className="text-gray-700 font-medium italic leading-relaxed">
        {typeof content === "string" 
          ? cleanTranscriptText(content)
          : content.map((block, index) => (
              <span key={index}>{renderContentBlock(block)}</span>
            ))
        }
      </p>
    </div>
  );
}

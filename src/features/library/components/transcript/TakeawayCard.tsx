// src/features/library/components/transcript/TakeawayCard.tsx

import { type ContentBlock } from "../../types/transcript";

type Props = {
  content: ContentBlock[] | string;
};

export default function TakeawayCard({ content }: Props) {
  const text =
    typeof content === "string"
      ? content
      : content
          .filter((block) => "value" in block)
          .map((block) => block.value)
          .join("");

  return (
    <div className="max-w-full mt-1.5 px-5 py-4.5 rounded-[16px] bg-gradient-to-br from-white to-[#FAF9F6] border-l-[3px] border-[#00A87E]">
      <div className="text-[10.5px] font-bold tracking-[0.06em] text-[#00A87E] uppercase mb-1.5">
        Takeaway
      </div>
      <p className="text-[13px] text-[#15161C] leading-relaxed">{text}</p>
    </div>
  );
}
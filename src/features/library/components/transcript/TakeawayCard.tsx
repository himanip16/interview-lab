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
    <div className="my-8 rounded-2xl border border-emerald-200 bg-emerald-50 p-6">
      <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-emerald-700">
        Key Takeaway
      </div>

      <p className="leading-relaxed text-gray-800">{text}</p>
    </div>
  );
}
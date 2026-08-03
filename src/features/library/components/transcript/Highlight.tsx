// src/features/library/components/transcript/Highlight.tsx
"use client";

import { type ContentBlock } from "../../types/transcript";

type Props = {
  highlight: ContentBlock & { type: "highlight" };
  onClick: (id: string) => void;
  isActive?: boolean;
};

export default function Highlight({ highlight, onClick, isActive = false }: Props) {
  return (
    <span
      onClick={() => onClick(highlight.id)}
      className="cursor-pointer inline bg-[rgba(232,148,10,0.22)] border-b-[1.5px] border-[#E8940A] rounded-[2px] px-[1px]"
    >
      {highlight.value}
    </span>
  );
}

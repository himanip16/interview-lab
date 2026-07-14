// src/features/library/components/transcript/Highlight.tsx
"use client";

import { type ContentBlock } from "../../types/transcript";

type Props = {
  highlight: ContentBlock & { type: "highlight" };
  onClick: (id: string) => void;
  isActive?: boolean;
};

export default function Highlight({ highlight, onClick, isActive = false }: Props) {
  const isStrong = highlight.status === "strong";
  
  return (
    <span
      onClick={() => onClick(highlight.id)}
      className={`cursor-pointer transition-all inline ${
        isStrong
          ? "bg-emerald-100 border-b-2 border-emerald-500 hover:bg-emerald-200/80"
          : "bg-rose-100 border-b-2 border-rose-500 hover:bg-rose-200/80"
      } ${isActive ? "ring-2 ring-offset-2 ring-blue-500" : ""}`}
    >
      {highlight.value}
    </span>
  );
}

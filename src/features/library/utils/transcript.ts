// src/features/library/utils/transcript.ts

import type { ContentBlock } from "../types/transcript";

export type Group =
  | { kind: "inline"; items: ContentBlock[] }
  | { kind: "block"; block: ContentBlock };

export function groupBlocks(blocks: ContentBlock[]): Group[] {
  const groups: Group[] = [];
  for (const block of blocks) {
    if (block.type === "text" || block.type === "highlight" || block.type === "concept") {
      const last = groups[groups.length - 1];
      if (last && last.kind === "inline") {
        last.items.push(block);
      } else {
        groups.push({ kind: "inline", items: [block] });
      }
    } else {
      groups.push({ kind: "block", block });
    }
  }
  return groups;
}

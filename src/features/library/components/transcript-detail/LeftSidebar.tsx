// src/features/library/components/transcript-detail/LeftSidebar.tsx

"use client";

import { useMemo } from "react";
import type { TranscriptSection, Concept } from "@/features/library/types/transcript";

type Props = {
  sections: TranscriptSection[];
  currentSectionIndex: number;
  progress: number;
  bookmarks: string[];
  allMessages: Array<{ id?: string; text: string }>;
  exploredConcepts: string[];
  concepts: Record<string, Concept>;
  onJumpToSection: (sectionId: string) => void;
  onJumpToMessage: (messageId: string) => void;
  onJumpToConcept: (conceptKey: string) => void;
};

export function LeftSidebar({
  sections,
  currentSectionIndex,
  progress,
  bookmarks,
  allMessages,
  exploredConcepts,
  concepts,
  onJumpToSection,
  onJumpToMessage,
  onJumpToConcept,
}: Props) {
  const bookmarkedMessages = useMemo(() => {
    return bookmarks
      .map((id) => allMessages.find((m) => m.id === id))
      .filter(Boolean) as Array<{ id: string; text: string }>;
  }, [bookmarks, allMessages]);

  return null; // LeftSidebar is now unused - all cards moved to RightSidebar
}

// src/features/library/components/transcript-detail/InlineContentRenderer.tsx

import type { ContentBlock, Concept } from "@/features/library/types/transcript";
import { InlineHighlight } from "./MessageBlock";
import { ConceptReference } from "./ConceptReference";

type Props = {
  items: ContentBlock[];
  concepts: Record<string, Concept>;
  onExploreConcept: (key: string) => void;
  openHighlightId: string | null;
  onToggleHighlight: (id: string) => void;
};

export function InlineContentRenderer({
  items,
  concepts,
  onExploreConcept,
  openHighlightId,
  onToggleHighlight,
}: Props) {
  const getHighlightKey = (item: Extract<ContentBlock, { type: "highlight" }>, index: number) => item.id ?? `highlight-${index}`;

  return (
    <p className="whitespace-pre-wrap">
      {items.map((item, ii) => {
        if (item.type === "highlight") {
          return (
            <InlineHighlight 
              key={getHighlightKey(item, ii)} 
              block={item} 
              onToggle={() => onToggleHighlight(getHighlightKey(item, ii))} 
            />
          );
        }
        if (item.type === "concept" && concepts[item.conceptKey]) {
          return (
            <ConceptReference
              key={ii}
              value={item.value}
              conceptKey={item.conceptKey}
              concept={concepts[item.conceptKey]}
              onExplore={onExploreConcept}
            />
          );
        }
        return <span key={ii}>{item.value}</span>;
      })}
    </p>
  );
}

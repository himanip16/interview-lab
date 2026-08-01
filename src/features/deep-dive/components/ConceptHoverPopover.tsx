// src/features/deep-dive/components/ConceptHoverPopover.tsx

import type { DeepDiveArticle, DeepDiveCategory } from "@/features/deep-dive/types";

interface ConceptHoverPopoverProps {
  article: DeepDiveArticle;
  whyItMatters?: string[];
  relatedConcepts?: Array<{ name: string; slug: string }>;
  isRead?: boolean;
  lastViewed?: string;
}

const categoryLabels: Record<DeepDiveCategory, string> = {
  db: "Database",
  msg: "Messaging",
  concept: "Concept",
  tools: "Tools",
  algorithms: "Algorithm",
  behavioral: "Behavioral",
  "data-structures": "Data Structure",
  streaming: "Streaming",
};

const categoryIcons: Record<DeepDiveCategory, string> = {
  db: "🗄️",
  msg: "📨",
  concept: "💡",
  tools: "🔧",
  algorithms: "⚡",
  behavioral: "🧠",
  "data-structures": "🏗️",
  streaming: "📡",
};

export function ConceptHoverPopover({
  article,
  whyItMatters = [],
  relatedConcepts = [],
  isRead = false,
  lastViewed,
}: ConceptHoverPopoverProps) {
  const { metadata, lede } = article;
  const categoryLabel = categoryLabels[metadata.category];
  const categoryIcon = categoryIcons[metadata.category];

  // Extract first 2-3 sentences from lede for explanation
  const explanation = lede
    .slice(0, 2)
    .map((p) => p.content.map((c) => (typeof c === "string" ? c : c.text)).join(""))
    .join(" ")
    .slice(0, 150)
    .trim() + "...";

  return (
    <div className="concept-popover">
      {/* Header with name and category */}
      <div className="concept-popover-header">
        <div className="concept-name">{metadata.name}</div>
        <div className={`concept-category concept-category-${metadata.category}`}>
          {categoryIcon} {categoryLabel}
        </div>
      </div>

      {/* Explanation */}
      <div className="concept-explanation">{explanation}</div>

      {/* Why it matters */}
      {whyItMatters.length > 0 && (
        <div className="concept-why-matters">
          <div className="concept-why-label">Why it matters here</div>
          <ul className="concept-why-list">
            {whyItMatters.map((point, i) => (
              <li key={i}>{point}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Reading status */}
      {isRead && (
        <div className="concept-read-status">
          ✓ Read {lastViewed && `· Last viewed ${lastViewed}`}
        </div>
      )}

      {/* CTA */}
      <div className="concept-cta">
        <span className="concept-reading-time">📖 {metadata.estimatedReadingMinutes} min</span>
        <span className="concept-read-link">Read Deep Dive →</span>
      </div>

      {/* Related concepts */}
      {relatedConcepts.length > 0 && (
        <div className="concept-related">
          <div className="concept-related-label">Related</div>
          <div className="concept-related-list">
            {relatedConcepts.map((concept) => (
              <span key={concept.slug} className="concept-related-item">
                {concept.name}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

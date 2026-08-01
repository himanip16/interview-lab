// src/features/library/components/transcript-detail/RightSidebar.tsx

"use client";

import type { ArchitectureNode } from "@/features/library/types/transcript";

type Props = {
  architectureSteps: ArchitectureNode[][];
  currentSectionIndex: number;
};

export function RightSidebar({ architectureSteps, currentSectionIndex }: Props) {
  const maxNodes = architectureSteps[architectureSteps.length - 1] || [];
  const visibleCount = (architectureSteps[Math.min(currentSectionIndex, architectureSteps.length - 1)] || []).length;

  // Don't render if there's no content to show
  if (!maxNodes || maxNodes.length === 0) {
    return null;
  }

  return (
    <div className="sticky top-5 hidden w-[200px] shrink-0 xl:block lg:block">
      <div
        className="rounded-[18px] border p-4.5"
        style={{ background: "#fff", borderColor: "rgba(21,22,28,0.07)" }}
      >
        <h3
          className="mb-3.5 text-[11px] font-bold uppercase tracking-wider"
          style={{ color: "#5A5B66" }}
        >
          System design, as it emerges
        </h3>
        <div className="flex flex-col">
          {maxNodes.map((node, index) => {
            const isVisible = index < visibleCount;
            return (
              <div key={index}>
                {index > 0 && (
                  <div
                    className="ml-6 h-3.5 transition-opacity duration-300"
                    style={{
                      width: "1.5px",
                      background: "rgba(21,22,28,0.15)",
                      opacity: isVisible ? 1 : 0
                    }}
                  />
                )}
                <div
                  className="flex items-center gap-2.5 rounded-[11px] px-3 py-2.5 text-[12px] font-semibold transition-all duration-400"
                  style={{
                    background: node.color,
                    color: "#fff",
                    opacity: isVisible ? 1 : 0,
                    transform: isVisible ? "translateY(0)" : "translateY(8px)"
                  }}
                >
                  {node.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

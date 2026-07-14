// src/features/library/components/TranscriptDetail.tsx
"use client";

import { useState, useEffect } from "react";
import { type ContentBlock, type TranscriptData } from "../types/transcript";
import Text from "@/components/ui/Text";
import Card from "@/components/ui/Card";
import DialogueBubble from "./transcript/DialogueBubble";
import HighlightExplanation from "./transcript/HighlightExplanation";
import TranscriptLegend from "./transcript/TranscriptLegend";
import TranscriptHeader from "./transcript/TranscriptHeader";

type Props = {
  onBack?: () => void;
};

// Helper to find all highlights in content
function findHighlights(content: ContentBlock[] | string): (ContentBlock & { type: "highlight" })[] {
  if (typeof content === "string") return [];
  return content.filter((block): block is ContentBlock & { type: "highlight" } => block.type === "highlight");
}

export default function TranscriptDetail({ onBack }: Props) {
  const [transcriptData, setTranscriptData] = useState<TranscriptData | null>(null);
  const [activeHighlightId, setActiveHighlightId] = useState<string | null>(null);
  const [activeHighlight, setActiveHighlight] = useState<(ContentBlock & { type: "highlight" }) | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMockData() {
      try {
        const response = await fetch("/mockTranscript.json");
        const data = await response.json();
        setTranscriptData(data);
      } catch (error) {
        console.error("Failed to load mock transcript data:", error);
      } finally {
        setLoading(false);
      }
    }
    loadMockData();
  }, []);

  const handleHighlightClick = (highlightId: string) => {
    if (!transcriptData) return;
    
    // Find the highlight in all messages
    for (const message of transcriptData.messages) {
      const highlights = findHighlights(message.content);
      const found = highlights.find((h) => h.id === highlightId);
      if (found) {
        if (activeHighlightId === highlightId) {
          setActiveHighlightId(null);
          setActiveHighlight(null);
        } else {
          setActiveHighlightId(highlightId);
          setActiveHighlight(found);
        }
        return;
      }
    }
  };

  const handleCloseExplanation = () => {
    setActiveHighlightId(null);
    setActiveHighlight(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Text variant="muted">Loading transcript...</Text>
      </div>
    );
  }

  if (!transcriptData) {
    return (
      <div className="flex items-center justify-center py-12">
        <Text variant="muted">Failed to load transcript data.</Text>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {onBack && (
        <button
          onClick={onBack}
          className="font-mono text-xs text-muted-foreground hover:text-foreground"
        >
          ← Back to library
        </button>
      )}

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-3">
        {/* Transcript */}
        <div className="space-y-4 lg:col-span-2">
          <Card className="p-6">
            <TranscriptHeader metadata={transcriptData.metadata} />
            
            <TranscriptLegend />

            <div className="max-h-[600px] space-y-4 overflow-y-auto pr-2">
              {transcriptData.messages.map((message, idx) => (
                <div key={message.id ?? idx}>
                  <DialogueBubble
                    role={message.role}
                    content={message.content}
                    elapsedSeconds={message.elapsedSeconds}
                    onHighlightClick={handleHighlightClick}
                    activeHighlightId={activeHighlightId}
                  />
                  {activeHighlightId && activeHighlight && (
                    <HighlightExplanation
                      highlight={activeHighlight}
                      onClose={handleCloseExplanation}
                    />
                  )}
                </div>
              ))}

              {transcriptData.messages.length === 0 && (
                <Text variant="muted">No messages in this transcript.</Text>
              )}
            </div>
          </Card>
        </div>

        {/* Evaluation Placeholder */}
        <div className="space-y-4">
          <Card className="p-6">
            <Text variant="muted">Evaluation panel coming soon...</Text>
          </Card>
        </div>
      </div>
    </div>
  );
}

// src/features/library/components/TranscriptDetail.tsx
"use client";

import { useState } from "react";
import { CompletedInterviewItem } from "../types";
import { type ContentBlock } from "../types/transcript";
import Text from "@/components/ui/Text";
import Card from "@/components/ui/Card";
import OverallScoreCard from "@/features/interview/report/components/OverallScoreCard";
import WhatHappenedCard from "@/features/interview/report/components/WhatHappenedCard";
import EvidenceTimeline from "@/features/interview/report/components/EvidenceTimeline";
import DialogueBubble from "./transcript/DialogueBubble";
import HighlightExplanation from "./transcript/HighlightExplanation";
import TranscriptLegend from "./transcript/TranscriptLegend";
import TranscriptMetadata from "./transcript/TranscriptMetadata";

type Props = {
  interview: CompletedInterviewItem;
  onBack: () => void;
};

// Helper function to convert legacy transcript to new format
function convertToEnhancedTranscript(transcript: any[]): any[] {
  return transcript.map((message) => {
    if (typeof message.content === "string") {
      // Legacy format - convert to new format
      return {
        ...message,
        role: message.role === "assistant" ? "interviewer" : "candidate",
        content: [{ type: "text", value: message.content }],
      };
    }
    return {
      ...message,
      role: message.role === "assistant" ? "interviewer" : "candidate",
    };
  });
}

// Helper to find all highlights in content
function findHighlights(content: ContentBlock[] | string): (ContentBlock & { type: "highlight" })[] {
  if (typeof content === "string") return [];
  return content.filter((block): block is ContentBlock & { type: "highlight" } => block.type === "highlight");
}

export default function TranscriptDetail({ interview, onBack }: Props) {
  const [activeHighlightId, setActiveHighlightId] = useState<string | null>(null);
  const [activeHighlight, setActiveHighlight] = useState<(ContentBlock & { type: "highlight" }) | null>(null);

  const enhancedTranscript = convertToEnhancedTranscript(interview.transcript);

  const handleHighlightClick = (highlightId: string) => {
    // Find the highlight in all messages
    for (const message of enhancedTranscript) {
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

  return (
    <div className="space-y-6">
      <button
        onClick={onBack}
        className="font-mono text-xs text-muted-foreground hover:text-foreground"
      >
        ← Back to completed interviews
      </button>

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-3">
        {/* Transcript */}
        <div className="space-y-4 lg:col-span-2">
          <Card className="p-6">
            <TranscriptMetadata
              title={interview.problem.title}
              difficulty={interview.difficulty}
              duration={interview.duration}
              template={interview.template.name}
            />
            
            <TranscriptLegend />

            <div className="max-h-[600px] space-y-4 overflow-y-auto pr-2">
              {enhancedTranscript.map((message, idx) => (
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

              {enhancedTranscript.length === 0 && (
                <Text variant="muted">No messages recorded for this session.</Text>
              )}
            </div>
          </Card>
        </div>

        {/* Evaluation */}
        <div className="space-y-4">
          {interview.evaluation ? (
            <>
              <OverallScoreCard score={interview.evaluation.overallScore} />
              <WhatHappenedCard
                observations={[]}
                strengths={interview.evaluation.metadata.strengths ?? []}
                weaknesses={interview.evaluation.metadata.weaknesses ?? []}
              />
            </>
          ) : (
            <Card className="p-6 text-center">
              <Text variant="muted">Evaluation still generating — check back shortly.</Text>
            </Card>
          )}
        </div>
      </div>

      {interview.evaluation &&
        interview.evaluation.evidence.length > 0 && (
          <EvidenceTimeline evidence={interview.evaluation.evidence} />
        )}
    </div>
  );
}

"use client";

import { useState } from "react";

import {
  type ContentBlock,
  type TranscriptData,
} from "../types/transcript";


import Card from "@/shared/ui/Card";
import Text from "@/shared/ui/Text";

import DialogueBubble from "./transcript/DialogueBubble";
import HighlightExplanation from "./transcript/HighlightExplanation";
import TranscriptHeader from "./transcript/TranscriptHeader";
import TranscriptLegend from "./transcript/TranscriptLegend";


type Props = {
  transcript: TranscriptData;
  summary: TranscriptSummary;
  showBackButton?: boolean;
};

function findHighlights(
  content: ContentBlock[] | string
): (ContentBlock & { type: "highlight" })[] {
  if (typeof content === "string") {
    return [];
  }

  return content.filter(
    (
      block
    ): block is ContentBlock & { type: "highlight" } =>
      block.type === "highlight"
  );
}

export default function TranscriptDetail({
  transcript,
  showBackButton = false,
}: Props) {
  const [activeHighlightId, setActiveHighlightId] =
    useState<string | null>(null);

  const [activeHighlight, setActiveHighlight] =
    useState<(ContentBlock & { type: "highlight" }) | null>(
      null
    );

  function handleHighlightClick(highlightId: string) {
    for (const message of transcript.messages) {
      const highlights = findHighlights(message.content);

      const found = highlights.find(
        (h) => h.id === highlightId
      );

      if (!found) {
        continue;
      }

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

  function handleCloseExplanation() {
    setActiveHighlightId(null);
    setActiveHighlight(null);
  }

  return (
    <div className="space-y-6">
      {showBackButton && (
        <button
          onClick={() => history.back()}
          className="font-mono text-xs text-muted-foreground hover:text-foreground"
        >
          ← Back
        </button>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <Card className="p-6">
            <TranscriptHeader
              metadata={transcript.metadata}
            />

            <TranscriptLegend />

            <div className="max-h-[700px] space-y-4 overflow-y-auto pr-2">
              {transcript.messages.map(
                (message, index) => (
                  <div
                    key={message.id ?? index}
                  >
                    <DialogueBubble
                      role={message.role}
                      content={message.content}
                      elapsedSeconds={
                        message.elapsedSeconds
                      }
                      onHighlightClick={
                        handleHighlightClick
                      }
                      activeHighlightId={
                        activeHighlightId
                      }
                    />

                    {activeHighlight &&
                      activeHighlightId && (
                        <HighlightExplanation
                          highlight={
                            activeHighlight
                          }
                          onClose={
                            handleCloseExplanation
                          }
                        />
                      )}
                  </div>
                )
              )}

              {transcript.messages.length ===
                0 && (
                <Text variant="muted">
                  No messages.
                </Text>
              )}
            </div>
          </Card>
        </div>

        <div className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-semibold">
              About this interview
            </h3>

            <div className="mt-4 space-y-2 text-sm">
              <div>
                <strong>Category:</strong>{" "}
                {transcript.metadata.category}
              </div>

              <div>
                <strong>Difficulty:</strong>{" "}
                {transcript.metadata.difficulty}
              </div>

              <div>
                <strong>Duration:</strong>{" "}
                {transcript.metadata.duration} min
              </div>

              <div>
                <strong>Template:</strong>{" "}
                {transcript.metadata.template}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
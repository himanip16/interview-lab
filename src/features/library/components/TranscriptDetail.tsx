// src/features/library/components/TranscriptDetail.tsx
"use client";

import { CompletedInterviewItem } from "../types";
import Text from "@/components/ui/Text";
import OverallScoreCard from "@/features/interview/report/components/OverallScoreCard";
import WhatHappenedCard from "@/features/interview/report/components/WhatHappenedCard";
import EvidenceTimeline from "@/features/interview/report/components/EvidenceTimeline";

type Props = {
  interview: CompletedInterviewItem;
  onBack: () => void;
};

function formatTimestamp(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remaining = Math.floor(seconds % 60);
  return `${minutes.toString().padStart(2, "0")}:${remaining
    .toString()
    .padStart(2, "0")}`;
}

export default function TranscriptDetail({ interview, onBack }: Props) {
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
          <div className="rounded-lg border border-border bg-card p-6">
            <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
              Live conversation log
            </span>
            <h3 className="mt-1 text-base font-bold text-foreground">
              {interview.problem.title} Transcript
            </h3>

            <div className="mt-6 max-h-[480px] space-y-4 divide-y divide-border overflow-y-auto pr-2">
              {interview.transcript.map((message, idx) => (
                <div key={message.id ?? idx} className="pt-4 first:pt-0">
                  <div className="mb-1 flex items-baseline justify-between">
                    <span
                      className={`font-mono text-[10px] font-bold uppercase tracking-wide ${
                        message.role === "assistant"
                          ? "text-muted-foreground"
                          : "text-foreground"
                      }`}
                    >
                      {message.role === "assistant" ? "Interviewer" : "Candidate"}
                    </span>
                    <span className="font-mono text-[10px] text-muted-foreground">
                      {formatTimestamp(message.elapsedSeconds)}
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed text-foreground">
                    {message.content}
                  </p>
                </div>
              ))}

              {interview.transcript.length === 0 && (
                <Text variant="muted">No messages recorded for this session.</Text>
              )}
            </div>
          </div>
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
            <div className="rounded-lg border border-border bg-card p-6 text-center">
              <Text variant="muted">Evaluation still generating — check back shortly.</Text>
            </div>
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

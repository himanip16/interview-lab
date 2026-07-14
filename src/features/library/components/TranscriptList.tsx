// src/features/library/components/TranscriptList.tsx
"use client";

import { CompletedInterviewItem } from "../types";
import Text from "@/components/ui/Text";

type Props = {
  completedInterviews: CompletedInterviewItem[];
  onSelectInterview: (interview: CompletedInterviewItem) => void;
};

export default function TranscriptList({ completedInterviews, onSelectInterview }: Props) {
  return (
    <div className="space-y-4">
      {completedInterviews.length > 0 ? (
        completedInterviews.map((session) => (
          <button
            key={session.id}
            onClick={() => onSelectInterview(session)}
            className="flex w-full items-center justify-between rounded-lg border border-border bg-card p-5 text-left transition hover:border-foreground/40"
          >
            <div>
              <h3 className="text-sm font-bold text-foreground">
                {session.problem.title} Transcript
              </h3>
              <span className="font-mono text-xs text-muted-foreground">
                {session.template.name} •{" "}
                {session.mode === "REVERSE" ? "Reverse mode" : "Candidate mode"} •{" "}
                {session.transcript.length} exchanges • {session.displayDate}
              </span>
            </div>

            <div className="flex items-center gap-4">
              {session.evaluation && (
                <div className="rounded border border-border bg-muted px-2.5 py-1">
                  <span className="font-mono text-xs font-bold text-foreground">
                    {session.evaluation.overallScore}/100
                  </span>
                </div>
              )}
              <span className="text-muted-foreground">→</span>
            </div>
          </button>
        ))
      ) : (
        <div className="rounded-lg border border-border bg-card p-12 text-center">
          <Text variant="muted">
            No session transcripts yet. Start a practice interview to
            generate an evaluation log.
          </Text>
        </div>
      )}
    </div>
  );
}

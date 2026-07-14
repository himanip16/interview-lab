// src/features/library/components/TranscriptList.tsx
"use client";

import { CompletedInterviewItem } from "../types";
import Card from "@/components/ui/Card";
import EmptyState from "./EmptyState";

type Props = {
  completedInterviews: CompletedInterviewItem[];
  onSelectInterview: (interview: CompletedInterviewItem) => void;
};

export default function TranscriptList({ completedInterviews, onSelectInterview }: Props) {
  return (
    <div className="space-y-4">
      {completedInterviews.length > 0 ? (
        completedInterviews.map((session) => (
          <Card
            key={session.id}
            className="p-5 cursor-pointer hover:border-foreground/40"
            onClick={() => onSelectInterview(session)}
          >
            <div className="flex w-full items-center justify-between">
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
            </div>
          </Card>
        ))
      ) : (
        <EmptyState message="No session transcripts yet. Start a practice interview to generate an evaluation log." />
      )}
    </div>
  );
}

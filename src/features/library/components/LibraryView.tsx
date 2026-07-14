// src/features/library/components/LibraryView.tsx
"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Difficulty,
  ExperienceSource,
  InterviewMode,
} from "@prisma/client";

import Heading from "@/components/ui/Heading";
import Text from "@/components/ui/Text";
import { Button } from "@/components/ui/Button";

import OverallScoreCard from "@/features/interview/report/components/OverallScoreCard";
import WhatHappenedCard from "@/features/interview/report/components/WhatHappenedCard";
import EvidenceTimeline from "@/features/interview/report/components/EvidenceTimeline";
import ProblemInventoryView from "@/features/interview/setup/components/ProblemInventoryView";

// ---------------------------------------------------------------------------
// Types — plain shapes matching the Prisma `include`s built in page.tsx.
// Kept local rather than importing Prisma payload generics to keep this
// component decoupled from the query shape.
// ---------------------------------------------------------------------------

export type ExperienceItem = {
  id: string;
  role: string | null;
  level: string | null;
  year: number | null;
  source: ExperienceSource;
  url: string;
  notes: string | null;
  problem: {
    id: string;
    title: string;
    description: string | null;
    difficulty: Difficulty;
  };
  company: {
    name: string;
  };
};

export type TranscriptMessage = {
  id: string;
  role: "assistant" | "user";
  content: string;
  elapsedSeconds: number;
};

type DimensionScore = {
  dimension: string;
  score: number;
  summary: string;
};

type EvidenceEntry = {
  dimension: string;
  timestampSeconds: number;
  quote: string;
  comment: string;
};

type EvaluationMetadata = {
  strengths?: string[];
  weaknesses?: string[];
};

export type CompletedInterviewItem = {
  id: string;
  mode: InterviewMode;
  difficulty: Difficulty;
  duration: number;
  company: string;
  displayDate: string; // pre-formatted on the server — avoids hydration mismatches
  problem: {
    title: string;
  };
  template: {
    name: string;
  };
  transcript: TranscriptMessage[];
  evaluation: {
    overallScore: number;
    feedback: string;
    dimensionScores: DimensionScore[];
    evidence: EvidenceEntry[];
    metadata: EvaluationMetadata;
  } | null;
};

type Props = {
  experiences: ExperienceItem[];
  completedInterviews: CompletedInterviewItem[];
};

type Tab = "problems" | "transcripts" | "diagrams" | "experiences";

const DIFFICULTY_STYLES: Record<Difficulty, string> = {
  EASY: "border-green-800 text-green-400",
  MEDIUM: "border-amber-800 text-amber-400",
  HARD: "border-red-800 text-red-400",
};

const SOURCE_LABELS: Record<ExperienceSource, string> = {
  LEETCODE: "LeetCode",
  ENGINEERBOOGIE: "EngineerBoogie",
  GLASSDOOR: "Glassdoor",
  USER_SUBMISSION: "Community Submission",
};

function formatTimestamp(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remaining = Math.floor(seconds % 60);
  return `${minutes.toString().padStart(2, "0")}:${remaining
    .toString()
    .padStart(2, "0")}`;
}

export default function LibraryView({ experiences, completedInterviews }: Props) {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<Tab>("problems");
  const [selectedInterview, setSelectedInterview] =
    useState<CompletedInterviewItem | null>(null);

  // Initialize tab from URL parameter
  useEffect(() => {
    const tabParam = searchParams.get("tab");
    if (tabParam === "problems" || tabParam === "transcripts" || tabParam === "diagrams" || tabParam === "experiences") {
      setActiveTab(tabParam as Tab);
    }
  }, [searchParams]);

  function switchTab(tab: Tab) {
    setActiveTab(tab);
    setSelectedInterview(null);
  }

  return (
    <main className="mx-auto max-w-5xl px-6 py-12 text-foreground">
      {/* Header */}
      <div className="flex flex-col gap-4 border-b border-border pb-6 md:flex-row md:items-end md:justify-between">
        <div>
          <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
            Knowledge Base
          </span>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-foreground">
            Personal Library
          </h1>
        </div>

        <div className="flex overflow-x-auto rounded-md border border-border bg-muted p-0.5">
          {(
            [
              ["problems", "Problem Library"],
              ["transcripts", "Completed Interviews"],
              ["experiences", "Interview Experiences"],
              ["diagrams", "Interactive Diagrams"],
            ] as [Tab, string][]
          ).map(([tab, label]) => (
            <button
              key={tab}
              onClick={() => switchTab(tab)}
              className={`whitespace-nowrap rounded px-4 py-1.5 font-mono text-xs transition ${
                activeTab === tab
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* ---------------------------------------------------------------- */}
      {/* Transcript detail                                                 */}
      {/* ---------------------------------------------------------------- */}
      {selectedInterview && (
        <div className="mt-8 space-y-6">
          <button
            onClick={() => setSelectedInterview(null)}
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
                  {selectedInterview.problem.title} Transcript
                </h3>

                <div className="mt-6 max-h-[480px] space-y-4 divide-y divide-border overflow-y-auto pr-2">
                  {selectedInterview.transcript.map((message, idx) => (
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

                  {selectedInterview.transcript.length === 0 && (
                    <Text variant="muted">No messages recorded for this session.</Text>
                  )}
                </div>
              </div>
            </div>

            {/* Evaluation */}
            <div className="space-y-4">
              {selectedInterview.evaluation ? (
                <>
                  <OverallScoreCard score={selectedInterview.evaluation.overallScore} />
                  <WhatHappenedCard
                    observations={[]}
                    strengths={selectedInterview.evaluation.metadata.strengths ?? []}
                    weaknesses={selectedInterview.evaluation.metadata.weaknesses ?? []}
                  />
                </>
              ) : (
                <div className="rounded-lg border border-border bg-card p-6 text-center">
                  <Text variant="muted">Evaluation still generating — check back shortly.</Text>
                </div>
              )}
            </div>
          </div>

          {selectedInterview.evaluation &&
            selectedInterview.evaluation.evidence.length > 0 && (
              <EvidenceTimeline evidence={selectedInterview.evaluation.evidence} />
            )}
        </div>
      )}

      {/* ---------------------------------------------------------------- */}
      {/* List views                                                        */}
      {/* ---------------------------------------------------------------- */}
      {!selectedInterview && (
        <div className="mt-8 space-y-6">
          {activeTab === "problems" && (
            <ProblemInventoryView onSelectProblem={(problemId) => {
              window.location.href = `/interview/setup?problemId=${problemId}`;
            }} />
          )}

          {activeTab === "transcripts" && (
            <div className="space-y-4">
              {completedInterviews.length > 0 ? (
                completedInterviews.map((session) => (
                  <button
                    key={session.id}
                    onClick={() => setSelectedInterview(session)}
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
          )}

          {activeTab === "experiences" && (
            <div className="space-y-4">
              {experiences.length > 0 ? (
                experiences.map((exp) => (
                  <a
                    key={exp.id}
                    href={exp.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex w-full items-center justify-between rounded-lg border border-border bg-card p-5 text-left transition hover:border-foreground/40"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <h3 className="text-sm font-bold text-foreground">
                          {exp.problem.title}
                        </h3>
                        <span
                          className={`rounded border px-2 py-0.5 text-xs font-mono uppercase tracking-wider ${DIFFICULTY_STYLES[exp.problem.difficulty]}`}
                        >
                          {exp.problem.difficulty}
                        </span>
                      </div>
                      <div className="mt-2 flex flex-wrap gap-2">
                        <span className="font-mono text-xs text-muted-foreground">
                          {exp.company.name}
                        </span>
                        {exp.role && (
                          <span className="font-mono text-xs text-muted-foreground">
                            • {exp.role}
                          </span>
                        )}
                        {exp.level && (
                          <span className="font-mono text-xs text-muted-foreground">
                            • {exp.level}
                          </span>
                        )}
                        {exp.year && (
                          <span className="font-mono text-xs text-muted-foreground">
                            • {exp.year}
                          </span>
                        )}
                      </div>
                      <div className="mt-2 flex items-center gap-2">
                        <span className="inline-block rounded bg-muted px-2 py-0.5 font-mono text-[10px] font-bold uppercase text-muted-foreground">
                          {SOURCE_LABELS[exp.source]}
                        </span>
                      </div>
                      {exp.notes && (
                        <p className="mt-2 text-xs text-muted-foreground line-clamp-2">
                          {exp.notes}
                        </p>
                      )}
                    </div>
                    <span className="text-muted-foreground">↗</span>
                  </a>
                ))
              ) : (
                <div className="rounded-lg border border-border bg-card p-12 text-center">
                  <Text variant="muted">
                    No interview experiences collected yet. These are gathered from
                    various sources to help you prepare for real interviews.
                  </Text>
                </div>
              )}
            </div>
          )}

          {activeTab === "diagrams" && (
            <div className="rounded-lg border border-border bg-card p-6">
              <Heading level="h4">System Design Blueprints</Heading>
              <Text variant="small" className="mt-2">
                Explore an interactive, clickable architecture diagram to see
                how each component's role, failure modes, and tradeoffs fit
                together.
              </Text>

              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                <Link
                  href="/learn/diagrams"
                  className="rounded border border-border bg-muted p-4 text-left transition hover:border-foreground/40"
                >
                  <span className="inline-block rounded bg-blue-500/10 px-2 py-0.5 font-mono text-[9px] font-bold uppercase text-blue-400">
                    Medium HLD
                  </span>
                  <h4 className="mt-2 text-xs font-bold text-foreground">
                    Design Dropbox
                  </h4>
                  <p className="mt-1 line-clamp-1 text-[10px] text-muted-foreground">
                    Metadata sync, block-level storage, and S3-backed durability.
                  </p>
                </Link>

                <Link
                  href="/learn/diagrams/twitter"
                  className="rounded border border-border bg-muted p-4 text-left transition hover:border-foreground/40"
                >
                  <span className="inline-block rounded bg-green-500/10 px-2 py-0.5 font-mono text-[9px] font-bold uppercase text-green-400">
                    Hard HLD
                  </span>
                  <h4 className="mt-2 text-xs font-bold text-foreground">
                    Design Twitter/X
                  </h4>
                  <p className="mt-1 line-clamp-1 text-[10px] text-muted-foreground">
                    Timeline generation, fanout writes, and eventual consistency.
                  </p>
                </Link>

                <Link
                  href="/learn/diagrams/netflix"
                  className="rounded border border-border bg-muted p-4 text-left transition hover:border-foreground/40"
                >
                  <span className="inline-block rounded bg-purple-500/10 px-2 py-0.5 font-mono text-[9px] font-bold uppercase text-purple-400">
                    Hard HLD
                  </span>
                  <h4 className="mt-2 text-xs font-bold text-foreground">
                    Design Netflix
                  </h4>
                  <p className="mt-1 line-clamp-1 text-[10px] text-muted-foreground">
                    Video streaming, CDN distribution, and personalized recommendations.
                  </p>
                </Link>

                <Link
                  href="/learn/diagrams/uber"
                  className="rounded border border-border bg-muted p-4 text-left transition hover:border-foreground/40"
                >
                  <span className="inline-block rounded bg-orange-500/10 px-2 py-0.5 font-mono text-[9px] font-bold uppercase text-orange-400">
                    Medium HLD
                  </span>
                  <h4 className="mt-2 text-xs font-bold text-foreground">
                    Design Uber
                  </h4>
                  <p className="mt-1 line-clamp-1 text-[10px] text-muted-foreground">
                    Real-time matching, geospatial indexing, and surge pricing.
                  </p>
                </Link>

                <Link
                  href="/learn/diagrams/instagram"
                  className="rounded border border-border bg-muted p-4 text-left transition hover:border-foreground/40"
                >
                  <span className="inline-block rounded bg-red-500/10 px-2 py-0.5 font-mono text-[9px] font-bold uppercase text-red-400">
                    Hard HLD
                  </span>
                  <h4 className="mt-2 text-xs font-bold text-foreground">
                    Design Instagram
                  </h4>
                  <p className="mt-1 line-clamp-1 text-[10px] text-muted-foreground">
                    Photo upload, feed generation, and story expiration.
                  </p>
                </Link>

                <Link
                  href="/learn/diagrams/whatsapp"
                  className="rounded border border-border bg-muted p-4 text-left transition hover:border-foreground/40"
                >
                  <span className="inline-block rounded bg-cyan-500/10 px-2 py-0.5 font-mono text-[9px] font-bold uppercase text-cyan-400">
                    Medium HLD
                  </span>
                  <h4 className="mt-2 text-xs font-bold text-foreground">
                    Design WhatsApp
                  </h4>
                  <p className="mt-1 line-clamp-1 text-[10px] text-muted-foreground">
                    Real-time messaging, message queues, and end-to-end encryption.
                  </p>
                </Link>
              </div>
            </div>
          )}
        </div>
      )}
    </main>
  );
}
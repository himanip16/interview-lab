// src/features/library/components/LibraryView.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Difficulty,
  ExperienceSource,
  InterviewMode,
} from "@prisma/client";

import Heading from "@/src/components/ui/Heading";
import Text from "@/src/components/ui/Text";
import { Button } from "@/src/components/ui/Button";

import OverallScoreCard from "@/src/features/interview/report/components/OverallScoreCard";
import WhatHappenedCard from "@/src/features/interview/report/components/WhatHappenedCard";
import EvidenceTimeline from "@/src/features/interview/report/components/EvidenceTimeline";

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

type Tab = "experiences" | "transcripts" | "diagrams";

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
  const [activeTab, setActiveTab] = useState<Tab>("experiences");
  const [selectedExperience, setSelectedExperience] =
    useState<ExperienceItem | null>(null);
  const [selectedInterview, setSelectedInterview] =
    useState<CompletedInterviewItem | null>(null);

  function switchTab(tab: Tab) {
    setActiveTab(tab);
    setSelectedExperience(null);
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
              ["experiences", "Interview Experiences"],
              ["transcripts", "Completed Interviews"],
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
      {/* Experience detail                                                 */}
      {/* ---------------------------------------------------------------- */}
      {selectedExperience && (
        <div className="mx-auto mt-8 max-w-3xl space-y-6">
          <button
            onClick={() => setSelectedExperience(null)}
            className="font-mono text-xs text-muted-foreground hover:text-foreground"
          >
            ← Back to experiences
          </button>

          <div className="overflow-hidden rounded-lg border border-border bg-card">
            <div className="flex flex-col gap-4 bg-muted p-6 md:flex-row md:items-start md:justify-between">
              <div>
                <span className="block font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                  {selectedExperience.company.name}
                  {selectedExperience.role ? ` • ${selectedExperience.role}` : ""}
                  {selectedExperience.level ? ` • ${selectedExperience.level}` : ""}
                </span>
                <h2 className="mt-1 text-xl font-bold text-foreground">
                  {selectedExperience.problem.title}
                </h2>
              </div>

              <span className="font-mono text-xs text-muted-foreground">
                {SOURCE_LABELS[selectedExperience.source]}
                {selectedExperience.year ? ` • ${selectedExperience.year}` : ""}
              </span>
            </div>

            <div className="space-y-6 p-8">
              {selectedExperience.problem.description && (
                <div className="grid grid-cols-1 gap-2 border-b border-border pb-6 md:grid-cols-4">
                  <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground md:col-span-1">
                    Problem
                  </span>
                  <p className="text-sm leading-relaxed text-foreground md:col-span-3">
                    {selectedExperience.problem.description}
                  </p>
                </div>
              )}

              {selectedExperience.notes && (
                <div className="grid grid-cols-1 gap-2 border-b border-border pb-6 md:grid-cols-4">
                  <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground md:col-span-1">
                    Notes
                  </span>
                  <p className="text-sm leading-relaxed text-foreground md:col-span-3">
                    {selectedExperience.notes}
                  </p>
                </div>
              )}

              <div className="grid grid-cols-1 gap-2 md:grid-cols-4">
                <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground md:col-span-1">
                  Source
                </span>
                <a
                  href={selectedExperience.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm text-primary hover:opacity-80 md:col-span-3"
                >
                  {selectedExperience.url}
                </a>
              </div>

              <div className="flex justify-end pt-2">
                <Link
                  href={`/interview/setup?problemId=${selectedExperience.problem.id}&type=hld`}
                >
                  <Button variant="primary" className="text-sm">
                    Practice this problem →
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

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
      {!selectedExperience && !selectedInterview && (
        <div className="mt-8 space-y-6">
          {activeTab === "experiences" && (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {experiences.length > 0 ? (
                experiences.map((exp) => (
                  <button
                    key={exp.id}
                    onClick={() => setSelectedExperience(exp)}
                    className="flex h-[180px] flex-col justify-between rounded-lg border border-border bg-card p-6 text-left transition hover:border-foreground/40"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between font-mono text-[10px] text-muted-foreground">
                        <span>
                          {exp.company.name}
                          {exp.level ? ` • ${exp.level}` : ""}
                        </span>
                        <span
                          className={`rounded border px-2 py-0.5 uppercase tracking-wider ${DIFFICULTY_STYLES[exp.problem.difficulty]}`}
                        >
                          {exp.problem.difficulty}
                        </span>
                      </div>
                      <h3 className="text-base font-semibold text-foreground">
                        {exp.problem.title}
                      </h3>
                    </div>

                    <div className="flex items-center justify-between border-t border-border pt-3 text-xs text-muted-foreground">
                      <span className="max-w-[60%] truncate">
                        {SOURCE_LABELS[exp.source]}
                      </span>
                      <span className="font-mono font-bold text-foreground">
                        Read entry →
                      </span>
                    </div>
                  </button>
                ))
              ) : (
                <div className="col-span-full rounded-lg border border-border bg-card p-12 text-center">
                  <Text variant="muted">
                    No interview experiences logged yet.
                  </Text>
                </div>
              )}
            </div>
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

          {activeTab === "diagrams" && (
            <div className="rounded-lg border border-border bg-card p-6">
              <Heading level="h4">System Design Blueprints</Heading>
              <Text variant="small" className="mt-2">
                Explore an interactive, clickable architecture diagram to see
                how each component's role, failure modes, and tradeoffs fit
                together.
              </Text>

              <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
                <Link
                  href="/diagram"
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
              </div>
            </div>
          )}
        </div>
      )}
    </main>
  );
}
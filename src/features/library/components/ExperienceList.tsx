// src/features/library/components/ExperienceList.tsx
"use client";

import { Difficulty, ExperienceSource } from "@prisma/client";
import { ExperienceItem } from "../types";
import Text from "@/components/ui/Text";

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

type Props = {
  experiences: ExperienceItem[];
};

export default function ExperienceList({ experiences }: Props) {
  return (
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
  );
}

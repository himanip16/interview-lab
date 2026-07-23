// src/features/interview/live/components/Sidebar.tsx

'use client';

import React from 'react';
import { ProblemCard } from './sidebar/ProblemCard';
import { DesignSummary } from './sidebar/DesignSummary';

interface SidebarProps {
  problem: {
    id: string;
    title: string;
    description: string | null;
  };
  currentPhase: string;
  summary: string;
  difficulty: string;
  company: string;
}

/**
 * Sidebar - Right panel
 *
 * Composes smaller components:
 * - ProblemCard (problem title, description, metadata)
 * - DesignSummary (summary text from backend)
 *
 * Future components to add:
 * - InterviewTips (phase-specific guidance)
 * - EvaluationPreview (live scoring if available)
 * - ResourceLinks (documentation links for this phase)
 *
 * All data flows down from backend.
 * Backend owns phase transitions, summaries, evaluations.
 */
export function Sidebar({
  problem,
  currentPhase,
  summary,
  difficulty,
  company,
}: SidebarProps) {
  return (
    <div className="w-80 border-l border-gray-200 bg-white p-6 overflow-y-auto">
      <ProblemCard
        title={problem.title}
        description={problem.description}
        difficulty={difficulty}
        company={company}
      />

      <div className="my-8" />

      <DesignSummary summary={summary} />
    </div>
  );
}
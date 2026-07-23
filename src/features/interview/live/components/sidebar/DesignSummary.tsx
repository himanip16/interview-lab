// src/features/interview/live/components/sidebar/DesignSummary.tsx

'use client';

import React from 'react';

interface DesignSummaryProps {
  summary: string;
}

/**
 * DesignSummary - Shows the running interview summary
 *
 * This is the `interview.summary` field from your database.
 * 
 * Updated by:
 * - IncrementalSummaryService (every 3 turns)
 * - On phase transitions
 * - On interview completion
 * - Backend owns all summary generation
 *
 * Frontend just displays it.
 * Never computes or modifies the summary.
 *
 * Format:
 * - Usually a multi-line text block
 * - Could be bullet points or prose
 * - Updated by the LLM
 */
export function DesignSummary({ summary }: DesignSummaryProps) {
  return (
    <div className="space-y-3">
      <p className="text-xs font-semibold text-teal-600 uppercase tracking-wider">
        Design Summary
      </p>

      {summary && summary !== 'Interview has not started yet.' ? (
        <div className="text-sm text-gray-700 space-y-2 whitespace-pre-wrap">
          {summary}
        </div>
      ) : (
        <p className="text-sm text-gray-400 italic">
          Summary will appear as the interview progresses.
        </p>
      )}
    </div>
  );
}
// src/features/interview/live/components/sidebar/ProblemCard.tsx

'use client';

import React from 'react';

interface ProblemCardProps {
  title: string;
  description: string | null;
  difficulty: string;
  company: string;
}

/**
 * ProblemCard - Shows the problem being solved
 *
 * Displays:
 * - Problem title
 * - Brief description (if available)
 * - Difficulty level
 * - Target company
 *
 * This is read-only context about the problem.
 * Problem definition is immutable during the interview.
 */
export function ProblemCard({
  title,
  description,
  difficulty,
  company,
}: ProblemCardProps) {
  return (
    <div className="space-y-3">
      <h2 className="text-lg font-semibold text-gray-900">{title}</h2>

      {description && (
        <p className="text-sm text-gray-600 line-clamp-3">{description}</p>
      )}

      <div className="flex gap-2 text-xs">
        <span className="inline-block px-2 py-1 rounded bg-gray-100 text-gray-700">
          {difficulty}
        </span>
        <span className="inline-block px-2 py-1 rounded bg-gray-100 text-gray-700">
          {company}
        </span>
      </div>
    </div>
  );
}
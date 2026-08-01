// src/features/skill-tree/components/TrackSwitchboard.tsx

import React from 'react';
import { cn } from '@/shared/utils/utils';

type TrackType = 'DSA' | 'LLD' | 'HLD';

interface TrackSwitchboardProps {
  activeTrack: TrackType;
  onTrackChange: (track: TrackType) => void;
}

const trackConfig: Record<
  TrackType,
  { label: string; description: string; color: string }
> = {
  DSA: {
    label: 'DSA',
    description: 'Data Structures & Algorithms',
    color: 'var(--category-info)',
  },
  LLD: {
    label: 'LLD',
    description: 'Low-Level Design',
    color: 'var(--category-concept)',
  },
  HLD: {
    label: 'HLD',
    description: 'High-Level Design',
    color: 'var(--category-practice)',
  },
};

/**
 * TrackSwitchboard Component
 * 
 * A persistent navigation switchboard to toggle between DSA, LLD, and HLD tracks.
 * Features:
 * - Three-track toggle with color-coded indicators
 * - Active state highlighting
 * - Smooth transitions between tracks
 */
export const TrackSwitchboard: React.FC<TrackSwitchboardProps> = ({
  activeTrack,
  onTrackChange,
}) => {
  return (
    <div className="flex items-center justify-center gap-2 px-6 py-4">
      {(Object.keys(trackConfig) as TrackType[]).map((track) => {
        const config = trackConfig[track];
        const isActive = activeTrack === track;

        return (
          <button
            key={track}
            onClick={() => onTrackChange(track)}
            className={cn(
              'relative px-6 py-3 rounded-[var(--radius-card)]',
              'transition-all duration-200',
              'border border-[var(--border-subtle)]',
              'hover:border-[var(--border-default)]',
              isActive
                ? 'bg-[var(--surface-panel)] shadow-[var(--shadow-hover)]'
                : 'bg-transparent'
            )}
            style={
              isActive
                ? {
                    borderColor: config.color,
                    boxShadow: `0 0 0 1px ${config.color}`,
                  }
                : undefined
            }
          >
            <div className="flex flex-col items-center gap-1">
              <span
                className={cn(
                  'text-sm font-bold uppercase tracking-wider',
                  isActive ? 'text-[var(--text-primary)]' : 'text-[var(--text-tertiary)]'
                )}
                style={isActive ? { color: config.color } : undefined}
              >
                {config.label}
              </span>
              <span
                className={cn(
                  'text-[10px] font-medium',
                  isActive ? 'text-[var(--text-secondary)]' : 'text-[var(--text-tertiary)]'
                )}
              >
                {config.description}
              </span>
            </div>

            {/* Active indicator dot */}
            {isActive && (
              <div
                className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: config.color }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
};

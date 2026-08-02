// src/features/skill-tree/components/StudyCard.tsx

import React from 'react';
import { cn } from '@/shared/utils/utils';
import { BookOpen, MessageSquare, Bug } from 'lucide-react';

interface StudyItem {
  id: string;
  title: string;
  description?: string;
  contentType: 'DEEP_DIVE' | 'TRANSCRIPT' | 'BUG_HUNT' | 'WHITEBOARD';
  contentSlug: string;
  order: number;
  isBossGate: boolean;
  status: 'locked' | 'available' | 'in-progress' | 'completed';
  isLocked: boolean;
}

interface StudyCardProps {
  item: StudyItem;
  isLocked?: boolean;
  onClick?: () => void;
}

const typeConfig = {
  'DEEP_DIVE': {
    icon: BookOpen,
    label: 'Deep Dive',
    color: 'var(--category-concept)',
  },
  'TRANSCRIPT': {
    icon: MessageSquare,
    label: 'Transcript',
    color: 'var(--category-info)',
  },
  'BUG_HUNT': {
    icon: Bug,
    label: 'Bug Hunt',
    color: 'var(--category-practice)',
  },
  'WHITEBOARD': {
    icon: BookOpen,
    label: 'Whiteboard',
    color: 'var(--category-live)',
  },
};

const statusConfig = {
  locked: {
    bgColor: 'var(--background-muted)',
    textColor: 'var(--text-tertiary)',
    borderColor: 'var(--border-subtle)',
  },
  available: {
    bgColor: 'var(--surface-panel)',
    textColor: 'var(--text-primary)',
    borderColor: 'var(--border-default)',
  },
  'in-progress': {
    bgColor: 'var(--surface-panel)',
    textColor: 'var(--text-primary)',
    borderColor: 'var(--category-live)',
  },
  completed: {
    bgColor: 'var(--category-learn-bg)',
    textColor: 'var(--category-learn-deep)',
    borderColor: 'var(--category-learn)',
  },
};

/**
 * StudyCard Component
 * 
 * Re-uses ListCard style for study items with icon slots.
 * Features:
 * - Type-specific icons (Book for Deep Dives, Chat for Transcripts)
 * - Locked state with grayscale and blur
 * - Status-based styling
 * - Hover interactions
 */
export const StudyCard: React.FC<StudyCardProps> = ({ item, isLocked = false, onClick }) => {
  const typeInfo = typeConfig[item.contentType as keyof typeof typeConfig];
  const statusInfo = statusConfig[isLocked ? 'locked' : item.status];
  const Icon = typeInfo.icon;

  return (
    <div
      className={cn(
        'flex items-center gap-4 p-4 rounded-[var(--radius-card)]',
        'border transition-all duration-200',
        'hover:translate-y-[-2px] hover:shadow-[var(--shadow-hover)]',
        isLocked && 'pointer-events-none',
        !isLocked && onClick && 'cursor-pointer'
      )}
      style={{
        backgroundColor: statusInfo.bgColor,
        borderColor: statusInfo.borderColor,
      }}
      onClick={!isLocked ? onClick : undefined}
    >
      {/* Icon Slot */}
      <div
        className="w-10 h-10 rounded-[var(--radius-bubble)] flex items-center justify-center flex-shrink-0"
        style={{
          backgroundColor: isLocked
            ? 'var(--border-subtle)'
            : `${typeInfo.color}15`,
        }}
      >
        <Icon
          className="w-5 h-5"
          style={{
            color: isLocked ? 'var(--text-tertiary)' : typeInfo.color,
          }}
        />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div
          className="font-semibold text-sm truncate"
          style={{ color: statusInfo.textColor }}
        >
          {item.title}
        </div>
        <div
          className="text-xs mt-0.5"
          style={{ color: 'var(--text-tertiary)' }}
        >
          {typeInfo.label}
        </div>
      </div>

      {/* Status Indicator */}
      <div className="flex-shrink-0">
        {item.status === 'completed' && (
          <div
            className="w-6 h-6 rounded-full flex items-center justify-center"
            style={{ backgroundColor: 'var(--category-learn)' }}
          >
            <svg
              className="w-4 h-4 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        )}
        {item.status === 'in-progress' && (
          <div className="pulse-dot w-2 h-2 rounded-full bg-[var(--category-live)]" />
        )}
        {item.status === 'locked' && (
          <div className="w-6 h-6 rounded-full border border-[var(--border-subtle)] flex items-center justify-center">
            <svg
              className="w-3 h-3 text-[var(--text-tertiary)]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
        )}
      </div>
    </div>
  );
};

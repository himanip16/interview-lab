// src/features/skill-tree/SkillTree.tsx

import React, { useState } from 'react';
import { cn } from '@/shared/utils/utils';
import { TrackSwitchboard } from './components/TrackSwitchboard';
import { LevelSection } from './components/LevelSection';
import { StudyCard } from './components/StudyCard';
import { BossGate } from './components/BossGate';

type TrackType = 'DSA' | 'LLD' | 'HLD';
type ProficiencyLevel = 'noob' | 'mid' | 'pro';

interface StudyItem {
  id: string;
  title: string;
  type: 'deep-dive' | 'transcript';
  status: 'locked' | 'available' | 'in-progress' | 'completed';
}

interface LevelData {
  level: ProficiencyLevel;
  title: string;
  description: string;
  items: StudyItem[];
  bossGate?: {
    id: string;
    title: string;
    status: 'locked' | 'available' | 'in-progress' | 'completed';
  };
}

interface TrackData {
  track: TrackType;
  levels: LevelData[];
}

const mockTrackData: Record<TrackType, TrackData> = {
  DSA: {
    track: 'DSA',
    levels: [
      {
        level: 'noob',
        title: 'Foundation',
        description: 'Build your core algorithmic thinking',
        items: [
          { id: 'dsa-1', title: 'Arrays & Hashing', type: 'deep-dive', status: 'completed' },
          { id: 'dsa-2', title: 'Two Pointers', type: 'transcript', status: 'completed' },
          { id: 'dsa-3', title: 'Sliding Window', type: 'deep-dive', status: 'in-progress' },
        ],
        bossGate: {
          id: 'dsa-boss-1',
          title: 'Array Manipulation Bug Hunt',
          status: 'available',
        },
      },
      {
        level: 'mid',
        title: 'Intermediate',
        description: 'Master complex patterns and data structures',
        items: [
          { id: 'dsa-4', title: 'Binary Search', type: 'deep-dive', status: 'locked' },
          { id: 'dsa-5', title: 'Linked Lists', type: 'transcript', status: 'locked' },
          { id: 'dsa-6', title: 'Trees & Graphs', type: 'deep-dive', status: 'locked' },
        ],
        bossGate: {
          id: 'dsa-boss-2',
          title: 'Graph Traversal Bug Hunt',
          status: 'locked',
        },
      },
      {
        level: 'pro',
        title: 'Advanced',
        description: 'Tackle system-level algorithmic challenges',
        items: [
          { id: 'dsa-7', title: 'Dynamic Programming', type: 'deep-dive', status: 'locked' },
          { id: 'dsa-8', title: 'Advanced Graphs', type: 'transcript', status: 'locked' },
          { id: 'dsa-9', title: 'String Algorithms', type: 'deep-dive', status: 'locked' },
        ],
        bossGate: {
          id: 'dsa-boss-3',
          title: 'Optimization Bug Hunt',
          status: 'locked',
        },
      },
    ],
  },
  LLD: {
    track: 'LLD',
    levels: [
      {
        level: 'noob',
        title: 'Foundation',
        description: 'Learn object-oriented design principles',
        items: [
          { id: 'lld-1', title: 'SOLID Principles', type: 'deep-dive', status: 'completed' },
          { id: 'lld-2', title: 'Design Patterns Basics', type: 'transcript', status: 'available' },
        ],
        bossGate: {
          id: 'lld-boss-1',
          title: 'Class Design Bug Hunt',
          status: 'locked',
        },
      },
      {
        level: 'mid',
        title: 'Intermediate',
        description: 'Design complex systems and APIs',
        items: [
          { id: 'lld-3', title: 'API Design', type: 'deep-dive', status: 'locked' },
          { id: 'lld-4', title: 'Database Modeling', type: 'transcript', status: 'locked' },
        ],
        bossGate: {
          id: 'lld-boss-2',
          title: 'API Integration Bug Hunt',
          status: 'locked',
        },
      },
      {
        level: 'pro',
        title: 'Advanced',
        description: 'Architect scalable distributed systems',
        items: [
          { id: 'lld-5', title: 'Microservices', type: 'deep-dive', status: 'locked' },
          { id: 'lld-6', title: 'Event-Driven Architecture', type: 'transcript', status: 'locked' },
        ],
        bossGate: {
          id: 'lld-boss-3',
          title: 'Distributed Systems Bug Hunt',
          status: 'locked',
        },
      },
    ],
  },
  HLD: {
    track: 'HLD',
    levels: [
      {
        level: 'noob',
        title: 'Foundation',
        description: 'Understand system design fundamentals',
        items: [
          { id: 'hld-1', title: 'Load Balancing', type: 'deep-dive', status: 'locked' },
          { id: 'hld-2', title: 'Caching Strategies', type: 'transcript', status: 'locked' },
        ],
        bossGate: {
          id: 'hld-boss-1',
          title: 'Scalability Bug Hunt',
          status: 'locked',
        },
      },
      {
        level: 'mid',
        title: 'Intermediate',
        description: 'Design real-world production systems',
        items: [
          { id: 'hld-3', title: 'Database Sharding', type: 'deep-dive', status: 'locked' },
          { id: 'hld-4', title: 'Message Queues', type: 'transcript', status: 'locked' },
        ],
        bossGate: {
          id: 'hld-boss-2',
          title: 'Consistency Bug Hunt',
          status: 'locked',
        },
      },
      {
        level: 'pro',
        title: 'Advanced',
        description: 'Architect hyper-scale distributed systems',
        items: [
          { id: 'hld-5', title: 'Consensus Algorithms', type: 'deep-dive', status: 'locked' },
          { id: 'hld-6', title: 'CAP Theorem Deep Dive', type: 'transcript', status: 'locked' },
        ],
        bossGate: {
          id: 'hld-boss-3',
          title: 'Fault Tolerance Bug Hunt',
          status: 'locked',
        },
      },
    ],
  },
};

/**
 * SkillTree Component
 * 
 * A progression map that visualizes the learning journey across DSA, LLD, and HLD tracks.
 * Features:
 * - Triple-Track Map with switchboard navigation
 * - Vertical timeline with level-based progression
 * - Color-coded level headers (Noob: Blue, Mid: Violet, Pro: Coral)
 * - Flow-line connectors between completed steps
 * - Locked states for advanced content
 * - Boss Gate challenges at each level
 */
export const SkillTree: React.FC = () => {
  const [activeTrack, setActiveTrack] = useState<TrackType>('DSA');
  const currentTrackData = mockTrackData[activeTrack];

  return (
    <div className="min-h-screen bg-[var(--surface-page)]">
      {/* Top Navigation Switchboard */}
      <div className="sticky top-0 z-50 bg-[var(--surface-page)] border-b border-[var(--border-subtle)]">
        <TrackSwitchboard
          activeTrack={activeTrack}
          onTrackChange={setActiveTrack}
        />
      </div>

      {/* Main Progression Map */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="relative">
          {/* Vertical Flow Line */}
          <div className="absolute left-8 top-0 bottom-0 w-px">
            <svg className="w-full h-full" preserveAspectRatio="none">
              <line
                x1="0"
                y1="0"
                x2="0"
                y2="100%"
                stroke="var(--border-subtle)"
                strokeWidth="2"
                className="flow-line"
                strokeDasharray="6 8"
              />
            </svg>
          </div>

          {/* Level Sections */}
          {currentTrackData.levels.map((levelData, index) => (
            <LevelSection
              key={levelData.level}
              level={levelData.level}
              title={levelData.title}
              description={levelData.description}
              isLocked={levelData.level === 'pro' && !isMidLevelComplete(currentTrackData.levels)}
            >
              {/* Study Cards */}
              <div className="space-y-3 ml-4">
                {levelData.items.map((item) => (
                  <StudyCard
                    key={item.id}
                    item={item}
                    isLocked={item.status === 'locked'}
                  />
                ))}
              </div>

              {/* Boss Gate */}
              {levelData.bossGate && (
                <div className="mt-6 ml-4">
                  <BossGate
                    title={levelData.bossGate.title}
                    status={levelData.bossGate.status}
                    isLocked={levelData.bossGate.status === 'locked'}
                  />
                </div>
              )}
            </LevelSection>
          ))}
        </div>
      </div>
    </div>
  );
};

// Helper function to check if mid-level is complete
function isMidLevelComplete(levels: LevelData[]): boolean {
  const midLevel = levels.find((l) => l.level === 'mid');
  if (!midLevel) return false;
  return midLevel.items.every((item) => item.status === 'completed');
}

// src/features/skill-tree/SkillTree.tsx

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { cn } from '@/shared/utils/utils';
import { TrackSwitchboard } from './components/TrackSwitchboard';
import { LevelSection } from './components/LevelSection';
import { StudyCard } from './components/StudyCard';
import { BossGate } from './components/BossGate';
import { getContentRoute } from './utils/routing';

type TrackType = 'DSA' | 'LLD' | 'HLD';
type ProficiencyLevel = 'noob' | 'mid' | 'pro';

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

interface LevelData {
  id: string;
  level: number;
  title: string;
  description: string;
  minXpNeeded: number;
  isLocked: boolean;
  items: StudyItem[];
  bossGate?: {
    id: string;
    title: string;
    status: 'locked' | 'available' | 'in-progress' | 'completed';
    isLocked: boolean;
  };
}

interface TrackData {
  path: {
    id: string;
    slug: string;
    title: string;
    description?: string;
  };
  levels: LevelData[];
  userXP: number;
}

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
 * - Data fetched from API with gatekeeper logic applied
 */
export const SkillTree: React.FC = () => {
  const [activeTrack, setActiveTrack] = useState<TrackType>('DSA');
  const [trackData, setTrackData] = useState<TrackData | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchTrackData(activeTrack);
  }, [activeTrack]);

  const fetchTrackData = async (track: TrackType) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/skill-tree/${track.toLowerCase()}`, {
        headers: {
          'x-user-id': 'demo-user', // In production, get from auth
        },
      });
      if (response.ok) {
        const data = await response.json();
        setTrackData(data);
      }
    } catch (error) {
      console.error('Error fetching track data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStepClick = (item: StudyItem) => {
    if (item.isLocked) return;
    
    const route = getContentRoute(item.contentType, item.contentSlug);
    router.push(route);
  };

  const handleBossGateClick = (bossGate: LevelData['bossGate']) => {
    if (!bossGate || bossGate.isLocked) return;
    
    const route = getContentRoute('BUG_HUNT', bossGate.id);
    router.push(route);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--surface-page)] flex items-center justify-center">
        <div className="text-[var(--text-secondary)]">Loading skill tree...</div>
      </div>
    );
  }

  if (!trackData) {
    return (
      <div className="min-h-screen bg-[var(--surface-page)] flex items-center justify-center">
        <div className="text-[var(--text-secondary)]">Failed to load skill tree data.</div>
      </div>
    );
  }

  const levelMap: Record<number, ProficiencyLevel> = {
    1: 'noob',
    2: 'mid',
    3: 'pro',
  };

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
          {trackData.levels.map((levelData) => {
            const proficiencyLevel = levelMap[levelData.level as keyof typeof levelMap];
            
            return (
              <LevelSection
                key={levelData.id}
                level={proficiencyLevel}
                title={levelData.title}
                description={levelData.description}
                isLocked={levelData.isLocked}
              >
                {/* Study Cards */}
                <div className="space-y-3 ml-4">
                  {levelData.items.map((item) => (
                    <StudyCard
                      key={item.id}
                      item={item}
                      isLocked={item.isLocked}
                      onClick={() => handleStepClick(item)}
                    />
                  ))}
                </div>

                {/* Boss Gate */}
                {levelData.bossGate && (
                  <div className="mt-6 ml-4">
                    <BossGate
                      title={levelData.bossGate.title}
                      status={levelData.bossGate.status}
                      isLocked={levelData.bossGate.isLocked}
                      onClick={() => handleBossGateClick(levelData.bossGate)}
                    />
                  </div>
                )}
              </LevelSection>
            );
          })}
        </div>
      </div>
    </div>
  );
};

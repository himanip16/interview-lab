"use client";

import React, { useState, useMemo } from 'react';
import { cn } from '@/shared/utils/utils';
import { Panel } from '@/shared/ui/Panel';
import { Breadcrumb } from '@/shared/layout/Breadcrumb';
import { WHITEBOARD_SYSTEMS, WHITEBOARD_SYSTEM_LIST } from '../data/whiteboardSystems';
import { SYSTEM_DESIGNS, SYSTEM_LAYOUTS } from '../data/whiteboardAdapter';
import { loadWhiteboardScene } from '../services/WhiteboardService';
import Whiteboard from './whiteboard/Whiteboard';
import { useRouter } from 'next/navigation';

export default function WhiteboardWorkspace({ initialSlug }: { initialSlug: string }) {
  const router = useRouter();
  const [currentSlug, setCurrentSlug] = useState(initialSlug);

  const system = WHITEBOARD_SYSTEMS[currentSlug] || WHITEBOARD_SYSTEMS['url-shortener'];
  
  // Load the whiteboard frame using the new unified system
  const frame = useMemo(() => {
    const design = SYSTEM_DESIGNS[currentSlug];
    const layout = SYSTEM_LAYOUTS[currentSlug];
    if (!design || !layout) return null;
    return loadWhiteboardScene(design, layout);
  }, [currentSlug]);

  return (
    <Panel variant="default" className="max-w-[1080px] mx-auto p-[30px_36px_36px] bg-white">
      {/* Navigation */}
      <div className="mb-8">
        <Breadcrumb
          items={[
            { label: 'Learn', href: '/learn' },
            { label: 'Whiteboarding', active: true }
          ]}
          onBack={() => router.push('/learn')}
        />
      </div>

      {/* Header & System Pills */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="heading-m font-semibold text-[var(--ink)]">{system.title}</h1>
            <div className="w-1.5 h-1.5 rounded-full bg-[var(--mint)] animate-pulse" />
          </div>
          <p className="body-s text-[var(--ink-400)]">Click nodes to inspect architectural tradeoffs</p>
        </div>

        <div className="flex flex-wrap gap-2">
          {WHITEBOARD_SYSTEM_LIST.map((sys) => (
            <button
              key={sys.slug}
              onClick={() => setCurrentSlug(sys.slug)}
              className={cn(
                "px-4 py-1.5 radius-pill text-xs font-semibold transition-all border",
                currentSlug === sys.slug 
                  ? "bg-[var(--ink)] text-white border-[var(--ink)]" 
                  : "bg-white text-[var(--ink-400)] border-[var(--border)] hover:border-[var(--ink-200)]"
              )}
            >
              {sys.label}
            </button>
          ))}
        </div>
      </div>

      {/* Unified Whiteboard Component */}
      {frame ? (
        <Whiteboard frame={frame} />
      ) : (
        <div className="rounded-[22px] border border-dashed border-[rgba(21,22,28,0.15)] p-8 flex flex-col justify-center items-center text-center min-h-[400px]">
          <p className="text-[13px] text-[#5A5B66]">
            Failed to load whiteboard data for {system.title}
          </p>
        </div>
      )}
    </Panel>
  );
}
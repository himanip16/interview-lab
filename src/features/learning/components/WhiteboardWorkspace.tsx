// src/features/learning/components/WhiteboardWorkspace.tsx

"use client";

import { useMemo } from 'react';
import { cn } from '@/shared/utils/utils';
import { WHITEBOARD_SYSTEMS } from '../data/whiteboardSystems';
import { SYSTEM_DESIGNS, SYSTEM_LAYOUTS } from '../data/whiteboardAdapter';
import { loadWhiteboardScene } from '../services/WhiteboardService';
import { InteractiveWhiteboard } from './whiteboard/InteractiveWhiteboard';
import { useRouter, useParams } from 'next/navigation';

export default function WhiteboardWorkspace() {
  const router = useRouter();
  const params = useParams();
  const currentSlug = (params.slug as string) || 'url-shortener';

  const system = WHITEBOARD_SYSTEMS[currentSlug] || WHITEBOARD_SYSTEMS['url-shortener'];
  
  // Load the whiteboard frame using the new unified system
  const frame = useMemo(() => {
    const design = SYSTEM_DESIGNS[currentSlug];
    const layout = SYSTEM_LAYOUTS[currentSlug];
    if (!design || !layout) return null;
    const baseFrame = loadWhiteboardScene(design, layout);
    
    // Get scenarios from the system registry
    const system = WHITEBOARD_SYSTEMS[currentSlug];
    
    return {
      diagram: baseFrame,
      learning: {
        scenarios: system?.scenarios ?? []
      }
    };
  }, [currentSlug]);

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-100">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-xl font-semibold text-gray-900">{system.title}</h1>
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        </div>
        <p className="text-sm text-gray-500">{system.oneLiner}</p>
        {frame?.learning.scenarios && frame.learning.scenarios.length > 0 && (
          <div className="mt-2 flex items-center gap-2 text-xs text-gray-400">
            <span className="font-medium text-gray-600">{frame.learning.scenarios.length} interactive flows</span>
            <span>·</span>
            <span>{frame.learning.scenarios.map(s => s.title).join(' · ')}</span>
          </div>
        )}
      </div>

      {/* Unified Whiteboard Component */}
      {frame ? (
        <InteractiveWhiteboard 
          diagram={frame.diagram}
          learning={frame.learning}
          systemTitle={system.title}
          systemDescription={system.oneLiner}
        />
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-500">
              Failed to load whiteboard data for {system.title}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
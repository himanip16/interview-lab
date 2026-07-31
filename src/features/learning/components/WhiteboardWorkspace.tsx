// src/features/learning/components/WhiteboardWorkspace.tsx

"use client";

import { useMemo } from 'react';
import { cn } from '@/shared/utils/utils';
import { WHITEBOARD_SYSTEMS, SYSTEM_DESIGNS, SYSTEM_LAYOUTS } from '../data/whiteboardSystems';
import { loadWhiteboardScene } from '../services/WhiteboardService';
import { InteractiveWhiteboard } from './whiteboard/InteractiveWhiteboard';
import { useRouter, useParams } from 'next/navigation';

export default function WhiteboardWorkspace() {
  const router = useRouter();
  const params = useParams();
  const currentSlug = (params.slug as string) || 'url-shortener';

  console.log('[WhiteboardWorkspace] Component rendered with slug:', currentSlug);

  const system = WHITEBOARD_SYSTEMS[currentSlug] || WHITEBOARD_SYSTEMS['url-shortener'];
  console.log('[WhiteboardWorkspace] System data:', system);
  
  // Check if system is implemented
  const isImplemented = SYSTEM_DESIGNS[currentSlug] && SYSTEM_LAYOUTS[currentSlug];
  console.log('[WhiteboardWorkspace] isImplemented:', isImplemented);
  console.log('[WhiteboardWorkspace] SYSTEM_DESIGNS keys:', Object.keys(SYSTEM_DESIGNS));
  console.log('[WhiteboardWorkspace] SYSTEM_LAYOUTS keys:', Object.keys(SYSTEM_LAYOUTS));
  
  // Load the whiteboard frame using the new unified system
  const frame = useMemo(() => {
    console.log('[WhiteboardWorkspace] useMemo - calculating frame');
    if (!isImplemented) {
      console.log('[WhiteboardWorkspace] useMemo - isImplemented is false, returning null');
      return null;
    }
    
    const design = SYSTEM_DESIGNS[currentSlug];
    const layout = SYSTEM_LAYOUTS[currentSlug];
    console.log('[WhiteboardWorkspace] useMemo - design:', design);
    console.log('[WhiteboardWorkspace] useMemo - layout:', layout);
    
    if (!design || !layout) {
      console.log('[WhiteboardWorkspace] useMemo - design or layout is null, returning null');
      return null;
    }
    
    const baseFrame = loadWhiteboardScene(design, layout);
    console.log('[WhiteboardWorkspace] useMemo - baseFrame:', baseFrame);
    
    // Get scenarios from the system registry
    const system = WHITEBOARD_SYSTEMS[currentSlug];
    console.log('[WhiteboardWorkspace] useMemo - system for scenarios:', system);
    
    const result = {
      diagram: baseFrame,
      learning: {
        scenarios: system?.scenarios ?? []
      }
    };
    console.log('[WhiteboardWorkspace] useMemo - final frame result:', result);
    
    return result;
  }, [currentSlug, isImplemented]);

  return (
    <div className="h-[calc(100vh-4rem)]">
      {/* Unified Whiteboard Component */}
      {isImplemented && frame ? (
        <>
          {console.log('[WhiteboardWorkspace] Rendering InteractiveWhiteboard with diagram:', frame.diagram)}
          {console.log('[WhiteboardWorkspace] Rendering InteractiveWhiteboard with learning:', frame.learning)}
          <InteractiveWhiteboard 
            diagram={frame.diagram}
            learning={frame.learning}
            systemTitle={system.title}
            systemDescription={system.oneLiner}
          />
        </>
      ) : (
        <>
          {console.log('[WhiteboardWorkspace] Showing Coming Soon - isImplemented:', isImplemented, 'frame:', frame)}
          <div className="flex-1 flex items-center justify-center h-full">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Coming Soon</h3>
              <p className="text-sm text-gray-500">
                {system.title} is currently being built. Check back later!
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
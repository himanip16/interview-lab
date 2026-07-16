"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { Inspector } from '@/components/layout/Inspector';
import { Panel } from '@/components/ui/Panel';
import { cn } from '@/lib/utils';
import {
  WHITEBOARD_SYSTEMS,
  WHITEBOARD_SYSTEM_LIST,
  type WhiteboardSystem,
} from '@/features/learning/data/whiteboardSystems';

export default function WhiteboardPage() {
  const router = useRouter();
  const [selectedSystemSlug, setSelectedSystemSlug] = useState<string>(
    WHITEBOARD_SYSTEM_LIST[0]?.slug ?? 'url-shortener'
  );

  const system: WhiteboardSystem | undefined = WHITEBOARD_SYSTEMS[selectedSystemSlug];
  const [selectedNodeId, setSelectedNodeId] = useState<string | undefined>(system?.nodes[0]?.id);

  // Reset selected node whenever the system changes so the inspector
  // never shows a node that doesn't belong to the current system.
  useEffect(() => {
    setSelectedNodeId(system?.nodes[0]?.id);
  }, [selectedSystemSlug, system]);

  const selectedData = system?.nodes.find((n) => n.id === selectedNodeId);

  return (
    <div className="min-h-screen bg-[var(--paper)] py-10 px-6">
      <Panel variant="default" className="max-w-[1080px] mx-auto p-[30px_36px_36px]">

        <div className="flex items-center justify-between mb-1.5">
          <Breadcrumb
            items={[
              { label: 'Learn', href: '/learn' },
              { label: 'Whiteboarding', active: true },
            ]}
            onBack={() => router.back()}
          />
        </div>

        <div className="flex items-center justify-between mt-4.5 mb-5">
          <h2 className="heading-m font-semibold">{system?.title ?? 'Select a system'}</h2>
          <div className="body-s text-[var(--ink-400)] flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 radius-full bg-[var(--mint)] animate-pulse" />
            Tap any component to inspect it
          </div>
        </div>

        {/* System Pills — now actually switch the dataset */}
        <div className="flex gap-2 mb-6.5">
          {WHITEBOARD_SYSTEM_LIST.map(({ slug, label }) => (
            <button
              key={slug}
              onClick={() => setSelectedSystemSlug(slug)}
              className={cn(
                'body-s font-semibold p-[7px_15px] radius-pill border border-[var(--border)] text-[var(--ink-400)] cursor-pointer',
                selectedSystemSlug === slug && 'bg-[var(--ink)] text-white border-[var(--ink)]'
              )}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="flex gap-5">
          <div className="flex-1 min-h-[380px] relative bg-[var(--paper)] radius-card p-5">
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <path d="M18 8 L75 8" vectorEffect="non-scaling-stroke" stroke="rgba(21,22,28,0.16)" strokeWidth="2" fill="none" strokeDasharray="5 6" className="animate-flow" />
              <path d="M40 8 L40 45" vectorEffect="non-scaling-stroke" stroke="rgba(21,22,28,0.16)" strokeWidth="2" fill="none" strokeDasharray="5 6" className="animate-flow" />
              <path d="M40 55 L40 78" vectorEffect="non-scaling-stroke" stroke="rgba(21,22,28,0.16)" strokeWidth="2" fill="none" strokeDasharray="5 6" className="animate-flow" />
            </svg>

            {system?.nodes.map((node) => (
              <div
                key={node.id}
                style={{ backgroundColor: node.color, ...node.position }}
                className={cn(
                  'absolute w-[150px] p-[14px_16px] radius-card text-white cursor-pointer transition-transform duration-[0.3s] ease-[cubic-bezier(0.34,1.56,0.64,1)] z-2 hover:-translate-y-[-4px]',
                  selectedNodeId === node.id && 'shadow-selected'
                )}
                onClick={() => setSelectedNodeId(node.id)}
              >
                <div className="w-2 h-2 radius-full bg-white/70 mb-2" />
                <div className="body-s font-semibold">{node.title}</div>
                <div className="caption text-white/65 mt-0.5">{node.kind}</div>
              </div>
            ))}

            <div className="flex gap-4 mt-4 caption text-[var(--ink-400)]">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 radius-full bg-[var(--coral)]" />
                Entry
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 radius-full bg-[var(--violet)]" />
                Logic
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 radius-full bg-[var(--mint-deep)]" />
                Storage
              </span>
            </div>
          </div>

          <div className="flex-0-0-[300px]">
            {selectedData ? (
              <Inspector
                title={selectedData.title}
                kind={selectedData.kind}
                color={selectedData.color}
                blocks={[
                  { label: 'Role & duty', content: selectedData.role },
                  { label: 'Deep dive', content: selectedData.deep },
                  { label: 'Failure modes', content: selectedData.failure },
                  { label: 'Tradeoffs', content: selectedData.tradeoffs },
                ]}
              />
            ) : (
              <div className="radius-card border border-[var(--border)] p-6 flex flex-col">
                <div className="m-auto text-center text-[var(--ink-400)] body-s">
                  Select a component on the left to see its role, internals, failure modes, and tradeoffs.
                </div>
              </div>
            )}
          </div>
        </div>
      </Panel>
    </div>
  );
}
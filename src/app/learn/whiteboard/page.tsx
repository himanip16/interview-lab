"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Breadcrumb } from '@/src/components/layout/Breadcrumb';
import { Inspector } from '@/src/components/layout/Inspector';
import { Panel } from '@/src/components/ui/Panel';
import { cn } from '@/src/lib/utils';

interface NodeData {
  id: string;
  title: string;
  kind: string;
  color: string;
  role: string;
  deep: string;
  failure: string;
  tradeoffs: string;
}

const NODES_DATA: Record<string, NodeData> = {
  client: {
    id: 'client',
    title: 'Client app',
    kind: 'Client · entry point',
    color: 'var(--coral)',
    role: 'Sends a long URL, gets back a short code, and redirects when that code is visited later.',
    deep: 'Caches the last few redirects locally so repeat visits skip the network round trip.',
    failure: 'If the gateway is unreachable, falls back to a "try again" state rather than a blank redirect.',
    tradeoffs: 'Could resolve short codes locally for speed, but that would mean shipping the whole mapping to every client — not worth it at this scale.'
  },
  gateway: {
    id: 'gateway',
    title: 'API gateway',
    kind: 'Gateway · routing',
    color: 'var(--ink)',
    role: 'Single entry point for reads and writes — validates the request and routes to the shortener service.',
    deep: 'Rate-limits by IP to stop one client from generating millions of codes.',
    failure: 'Stateless, so any instance can go down without losing in-flight requests — the load balancer just stops sending it traffic.',
    tradeoffs: 'Centralizing here adds a hop, but keeping auth and rate-limiting in one place beats duplicating it in every service.'
  },
  service: {
    id: 'service',
    title: 'Shortener service',
    kind: 'Service · core logic',
    color: 'var(--violet)',
    role: 'Generates a unique short code and writes the mapping; resolves a code back to the original URL on read.',
    deep: 'Uses base62 encoding over an auto-incrementing counter, so codes stay short and collisions are structurally impossible.',
    failure: 'If code generation fails mid-write, the write is retried with a fresh counter value rather than silently returning a broken link.',
    tradeoffs: 'Hash-based codes would avoid a shared counter, but base62-over-counter is simpler and collisions become the harder problem to solve.'
  },
  db: {
    id: 'db',
    title: 'Key-value store',
    kind: 'Storage · key-value',
    color: 'var(--mint-deep)',
    role: 'Stores the short-code to long-URL mapping and serves reads with very low latency.',
    deep: 'Reads are cached in front of the store, since the access pattern is extremely read-heavy relative to writes.',
    failure: 'Replicated across zones — losing one replica costs latency, not data.',
    tradeoffs: 'A relational database would make analytics easier, but a key-value store is a better match for how this data is actually accessed: by exact key, constantly.'
  }
};

export default function WhiteboardPage() {
  const router = useRouter();
  const [selectedNode, setSelectedNode] = useState<string>('client');
  const [selectedSystem, setSelectedSystem] = useState<string>('URL shortener');

  const selectedData = NODES_DATA[selectedNode];

  return (
    <div className="min-h-screen bg-[var(--paper)] py-10 px-6">
      <Panel variant="default" className="max-w-[1080px] mx-auto p-[30px_36px_36px]">
        
        {/* Breadcrumb */}
        <div className="flex items-center justify-between mb-1.5">
          <Breadcrumb
            items={[
              { label: 'Learn', href: '/learn' },
              { label: 'Whiteboarding', active: true }
            ]}
            onBack={() => router.back()}
          />
        </div>

        {/* Title Section */}
        <div className="flex items-center justify-between mt-4.5 mb-5">
          <h2 className="heading-m font-semibold">Design a URL shortener</h2>
          <div className="body-s text-[var(--ink-400)] flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 radius-full bg-[var(--mint)] animate-pulse" />
            Tap any component to inspect it
          </div>
        </div>

        {/* System Pills */}
        <div className="flex gap-2 mb-6.5">
          {['URL shortener', 'Uber', 'Netflix', 'WhatsApp'].map((system) => (
            <button
              key={system}
              onClick={() => setSelectedSystem(system)}
              className={cn(
                'body-s font-semibold p-[7px_15px] radius-pill border border-[var(--border)] text-[var(--ink-400)] cursor-pointer',
                selectedSystem === system && 'bg-[var(--ink)] text-white border-[var(--ink)]'
              )}
            >
              {system}
            </button>
          ))}
        </div>

        {/* Stage Layout */}
        <div className="flex gap-5">
          {/* Diagram */}
          <div className="flex-1 min-h-[380px] relative bg-[var(--paper)] radius-card p-5">
            {/* SVG Wires */}
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <path 
                d="M18 8 L75 8" 
                vectorEffect="non-scaling-stroke"
                stroke="rgba(21,22,28,0.16)"
                strokeWidth="2"
                fill="none"
                strokeDasharray="5 6"
                className="animate-flow"
              />
              <path 
                d="M40 8 L40 45" 
                vectorEffect="non-scaling-stroke"
                stroke="rgba(21,22,28,0.16)"
                strokeWidth="2"
                fill="none"
                strokeDasharray="5 6"
                className="animate-flow"
              />
              <path 
                d="M40 55 L40 78" 
                vectorEffect="non-scaling-stroke"
                stroke="rgba(21,22,28,0.16)"
                strokeWidth="2"
                fill="none"
                strokeDasharray="5 6"
                className="animate-flow"
              />
            </svg>

            {/* Nodes */}
            <div
              className={cn(
                'absolute w-[150px] p-[14px_16px] radius-card text-white cursor-pointer transition-transform duration-[0.3s] ease-[cubic-bezier(0.34,1.56,0.64,1)] z-2',
                'top-6 left-6 bg-[var(--coral)] hover:-translate-y-[-4px]',
                selectedNode === 'client' && 'shadow-selected'
              )}
              onClick={() => setSelectedNode('client')}
            >
              <div className="w-2 h-2 radius-full bg-white/70 mb-2" />
              <div className="body-s font-semibold">Client app</div>
              <div className="caption text-white/65 mt-0.5">Entry point</div>
            </div>

            <div
              className={cn(
                'absolute w-[150px] p-[14px_16px] radius-card text-white cursor-pointer transition-transform duration-[0.3s] ease-[cubic-bezier(0.34,1.56,0.64,1)] z-2',
                'top-6 right-6 bg-[var(--ink)] hover:-translate-y-[-4px]',
                selectedNode === 'gateway' && 'shadow-selected'
              )}
              onClick={() => setSelectedNode('gateway')}
            >
              <div className="w-2 h-2 radius-full bg-white/70 mb-2" />
              <div className="body-s font-semibold">API gateway</div>
              <div className="caption text-white/65 mt-0.5">Routing & auth</div>
            </div>

            <div
              className={cn(
                'absolute w-[150px] p-[14px_16px] radius-card text-white cursor-pointer transition-transform duration-[0.3s] ease-[cubic-bezier(0.34,1.56,0.64,1)] z-2',
                'top-[200px] left-1/2 -translate-x-1/2 bg-[var(--violet)] hover:-translate-y-[-4px]',
                selectedNode === 'service' && 'shadow-selected'
              )}
              onClick={() => setSelectedNode('service')}
            >
              <div className="w-2 h-2 radius-full bg-white/70 mb-2" />
              <div className="body-s font-semibold">Shortener service</div>
              <div className="caption text-white/65 mt-0.5">Core logic</div>
            </div>

            <div
              className={cn(
                'absolute w-[150px] p-[14px_16px] radius-card text-white cursor-pointer transition-transform duration-[0.3s] ease-[cubic-bezier(0.34,1.56,0.64,1)] z-2',
                'bottom-6 left-1/2 -translate-x-1/2 bg-[var(--mint-deep)] hover:-translate-y-[-4px]',
                selectedNode === 'db' && 'shadow-selected'
              )}
              onClick={() => setSelectedNode('db')}
            >
              <div className="w-2 h-2 radius-full bg-white/70 mb-2" />
              <div className="body-s font-semibold">Key-value store</div>
              <div className="caption text-white/65 mt-0.5">Storage</div>
            </div>

            {/* Legend */}
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

          {/* Inspector */}
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
                  { label: 'Tradeoffs', content: selectedData.tradeoffs }
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

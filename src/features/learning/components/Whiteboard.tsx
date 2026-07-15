"use client";

import { useState } from "react";

const DATA = {
  client: { 
    color:'var(--coral)', 
    kind:'Client · entry point', 
    role:'Sends a long URL, gets back a short code, and redirects when that code is visited later.',
    deep:'Caches the last few redirects locally so repeat visits skip the network round trip.',
    failure:'If the gateway is unreachable, falls back to a "try again" state rather than a blank redirect.',
    tradeoffs:'Could resolve short codes locally for speed, but that would mean shipping the whole mapping to every client — not worth it at this scale.' 
  },
  gateway: { 
    color:'var(--ink)', 
    kind:'Gateway · routing', 
    role:'Single entry point for reads and writes — validates the request and routes to the shortener service.',
    deep:'Rate-limits by IP to stop one client from generating millions of codes.',
    failure:'Stateless, so any instance can go down without losing in-flight requests — the load balancer just stops sending it traffic.',
    tradeoffs:'Centralizing here adds a hop, but keeping auth and rate-limiting in one place beats duplicating it in every service.' 
  },
  service: { 
    color:'var(--violet)', 
    kind:'Service · core logic', 
    role:'Generates a unique short code and writes the mapping; resolves a code back to the original URL on read.',
    deep:'Uses base62 encoding over an auto-incrementing counter, so codes stay short and collisions are structurally impossible.',
    failure:'If code generation fails mid-write, the write is retried with a fresh counter value rather than silently returning a broken link.',
    tradeoffs:'Hash-based codes would avoid a shared counter, but base62-over-counter is simpler and collisions become the harder problem to solve.' 
  },
  db: { 
    color:'var(--mint-deep)', 
    kind:'Storage · key-value', 
    role:'Stores the short-code to long-URL mapping and serves reads with very low latency.',
    deep:'Reads are cached in front of the store, since the access pattern is extremely read-heavy relative to writes.',
    failure:'Replicated across zones — losing one replica costs latency, not data.',
    tradeoffs:'A relational database would make analytics easier, but a key-value store is a better match for how this data is actually accessed: by exact key, constantly.' 
  }
};

export default function Whiteboard() {
  const [selectedId, setSelectedId] = useState('client');
  const [selectedSystem, setSelectedSystem] = useState('URL shortener');

  const handleSelect = (id: string, el: HTMLDivElement) => {
    setSelectedId(id);
  };

  return (
    <div className="panel max-w-[1080px] mx-auto bg-white rounded-[32px] p-[30px_36px_36px] shadow-[0_24px_60px_rgba(21,22,28,0.06)] border border-[rgba(21,22,28,0.06)]">
      {/* Top Section */}
      <div className="top flex items-center justify-between mb-1.5">
        <div className="crumb flex items-center gap-2 text-[13px] text-[#5A5B66] font-medium">
          <button className="back w-8 h-8 rounded-full border border-[rgba(21,22,28,0.1)] bg-none text-[#15161C] flex items-center justify-center cursor-pointer">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
              <path d="M15 6l-6 6 6 6"/>
            </svg>
          </button>
          Learn &nbsp;/&nbsp; <b className="text-[#15161C] font-semibold">Whiteboarding</b>
        </div>
      </div>

      {/* Title Section */}
      <div className="title-row flex items-center justify-between mt-4.5 mb-5">
        <h2 className="text-[23px] font-semibold text-[#15161C] font-['Poppins']">Design a URL shortener</h2>
        <div className="hint text-[12.5px] text-[#5A5B66] flex items-center gap-1.5">
          <span className="pulse w-1.5 h-1.5 rounded-full bg-[var(--mint)]">
            <style>{`
              @keyframes pulse {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.25; }
              }
              .pulse {
                animation: pulse 1.8s ease-in-out infinite;
              }
            `}</style>
          </span>
          Tap any component to inspect it
        </div>
      </div>

      {/* System Pills */}
      <div className="system-pills flex gap-2 mb-6.5">
        {['URL shortener', 'Uber', 'Netflix', 'WhatsApp'].map((system) => (
          <button
            key={system}
            onClick={() => setSelectedSystem(system)}
            className={`pill text-[12.5px] font-semibold p-[7px_15px] rounded-[999px] border border-[rgba(21,22,28,0.1)] text-[#5A5B66] cursor-pointer ${selectedSystem === system ? 'active bg-[#15161C] text-white border-[#15161C]' : ''}`}
          >
            {system}
          </button>
        ))}
      </div>

      {/* Stage */}
      <div className="stage flex gap-5">
        {/* Diagram */}
        <div className="diagram flex-1 min-h-[380px] relative bg-[#FAF9F6] rounded-[22px] p-5">
          <svg className="wires absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M18 8 L75 8" vectorEffect="non-scaling-stroke" stroke="rgba(21,22,28,0.16)" strokeWidth="2" fill="none" strokeDasharray="5 6">
              <style>{`
                @keyframes flow {
                  to { stroke-dashoffset: -22; }
                }
                path {
                  animation: flow 1.4s linear infinite;
                }
              `}</style>
            </path>
            <path d="M40 8 L40 45" vectorEffect="non-scaling-stroke" stroke="rgba(21,22,28,0.16)" strokeWidth="2" fill="none" strokeDasharray="5 6">
              <style>{`
                @keyframes flow {
                  to { stroke-dashoffset: -22; }
                }
                path {
                  animation: flow 1.4s linear infinite;
                }
              `}</style>
            </path>
            <path d="M40 55 L40 78" vectorEffect="non-scaling-stroke" stroke="rgba(21,22,28,0.16)" strokeWidth="2" fill="none" strokeDasharray="5 6">
              <style>{`
                @keyframes flow {
                  to { stroke-dashoffset: -22; }
                }
                path {
                  animation: flow 1.4s linear infinite;
                }
              `}</style>
            </path>
          </svg>

          {/* Nodes */}
          <div 
            className={`node n-client absolute w-[150px] p-[14px_16px] rounded-[16px] text-white cursor-pointer transition-transform duration-[0.3s] ease-[cubic-bezier(0.34,1.56,0.64,1)] z-10 ${selectedId === 'client' ? 'selected shadow-[0_0_0_3px_rgba(0,217,163,0.35)]' : ''}`}
            style={{ top: '24px', left: '24px', background: 'var(--coral)' }}
            onClick={(e) => handleSelect('client', e.currentTarget)}
          >
            <div className="dot w-2 h-2 rounded-full bg-white/70 mb-2"></div>
            <div className="name text-[13.5px] font-semibold">Client app</div>
            <div className="kind text-[10.5px] text-white/65 mt-0.5">Entry point</div>
          </div>

          <div 
            className={`node n-gateway absolute w-[150px] p-[14px_16px] rounded-[16px] text-white cursor-pointer transition-transform duration-[0.3s] ease-[cubic-bezier(0.34,1.56,0.64,1)] z-10 ${selectedId === 'gateway' ? 'selected shadow-[0_0_0_3px_rgba(0,217,163,0.35)]' : ''}`}
            style={{ top: '24px', right: '24px', background: 'var(--ink)' }}
            onClick={(e) => handleSelect('gateway', e.currentTarget)}
          >
            <div className="dot w-2 h-2 rounded-full bg-white/70 mb-2"></div>
            <div className="name text-[13.5px] font-semibold">API gateway</div>
            <div className="kind text-[10.5px] text-white/65 mt-0.5">Routing &amp; auth</div>
          </div>

          <div 
            className={`node n-service absolute w-[150px] p-[14px_16px] rounded-[16px] text-white cursor-pointer transition-transform duration-[0.3s] ease-[cubic-bezier(0.34,1.56,0.64,1)] z-10 ${selectedId === 'service' ? 'selected shadow-[0_0_0_3px_rgba(0,217,163,0.35)]' : ''}`}
            style={{ top: '200px', left: '50%', transform: 'translateX(-50%)', background: 'var(--violet)' }}
            onClick={(e) => handleSelect('service', e.currentTarget)}
          >
            <div className="dot w-2 h-2 rounded-full bg-white/70 mb-2"></div>
            <div className="name text-[13.5px] font-semibold">Shortener service</div>
            <div className="kind text-[10.5px] text-white/65 mt-0.5">Core logic</div>
          </div>

          <div 
            className={`node n-db absolute w-[150px] p-[14px_16px] rounded-[16px] text-white cursor-pointer transition-transform duration-[0.3s] ease-[cubic-bezier(0.34,1.56,0.64,1)] z-10 ${selectedId === 'db' ? 'selected shadow-[0_0_0_3px_rgba(0,217,163,0.35)]' : ''}`}
            style={{ bottom: '24px', left: '50%', transform: 'translateX(-50%)', background: 'var(--mint-deep)' }}
            onClick={(e) => handleSelect('db', e.currentTarget)}
          >
            <div className="dot w-2 h-2 rounded-full bg-white/70 mb-2"></div>
            <div className="name text-[13.5px] font-semibold">Key-value store</div>
            <div className="kind text-[10.5px] text-white/65 mt-0.5">Storage</div>
          </div>

          {/* Legend */}
          <div className="legend flex gap-4 mt-4 text-[11.5px] text-[#5A5B66]">
            <span className="flex items-center gap-1.5"><span className="sw w-2 h-2 rounded-full" style={{ background: 'var(--coral)' }}></span>Entry</span>
            <span className="flex items-center gap-1.5"><span className="sw w-2 h-2 rounded-full" style={{ background: 'var(--violet)' }}></span>Logic</span>
            <span className="flex items-center gap-1.5"><span className="sw w-2 h-2 rounded-full" style={{ background: 'var(--mint-deep)' }}></span>Storage</span>
          </div>
        </div>

        {/* Inspector */}
        <div className="inspector flex-0-0-[300px] rounded-[22px] border border-[rgba(21,22,28,0.08)] p-6 flex flex-col">
          {selectedId && DATA[selectedId as keyof typeof DATA] ? (
            <>
              <div className="ins-head flex items-center gap-2.5 mb-4.5">
                <div className="ins-dot w-[34px] h-[34px] rounded-[10px] flex items-center justify-center text-white" style={{ background: DATA[selectedId as keyof typeof DATA].color }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <circle cx="12" cy="12" r="8"/>
                  </svg>
                </div>
                <div>
                  <h3 className="text-[16px] font-semibold text-[#15161C] font-['Poppins']">
                    {selectedId === 'client' ? 'Client app' : selectedId === 'gateway' ? 'API gateway' : selectedId === 'service' ? 'Shortener service' : 'Key-value store'}
                  </h3>
                  <div className="kind text-[11px] text-[#5A5B66]">{DATA[selectedId as keyof typeof DATA].kind}</div>
                </div>
              </div>

              <div className="ins-block mb-4">
                <div className="ins-label text-[10.5px] font-bold tracking-[0.06em] text-[var(--mint-deep)] mb-1.5 text-transform:uppercase">Role &amp; duty</div>
                <div className="ins-text text-[12.5px] text-[#5A5B66] leading-[1.6]">{DATA[selectedId as keyof typeof DATA].role}</div>
              </div>

              <div className="ins-block mb-4">
                <div className="ins-label text-[10.5px] font-bold tracking-[0.06em] text-[var(--mint-deep)] mb-1.5 text-transform:uppercase">Deep dive</div>
                <div className="ins-text text-[12.5px] text-[#5A5B66] leading-[1.6]">{DATA[selectedId as keyof typeof DATA].deep}</div>
              </div>

              <div className="ins-block mb-4">
                <div className="ins-label text-[10.5px] font-bold tracking-[0.06em] text-[var(--mint-deep)] mb-1.5 text-transform:uppercase">Failure modes</div>
                <div className="ins-text text-[12.5px] text-[#5A5B66] leading-[1.6]">{DATA[selectedId as keyof typeof DATA].failure}</div>
              </div>

              <div className="ins-block">
                <div className="ins-label text-[10.5px] font-bold tracking-[0.06em] text-[var(--mint-deep)] mb-1.5 text-transform:uppercase">Tradeoffs</div>
                <div className="ins-text text-[12.5px] text-[#5A5B66] leading-[1.6]">{DATA[selectedId as keyof typeof DATA].tradeoffs}</div>
              </div>
            </>
          ) : (
            <div className="empty m-auto text-center text-[13px] text-[#5A5B66]">
              Select a component on the left to see its role, internals, failure modes, and tradeoffs.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

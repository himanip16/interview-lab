"use client";

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { getDeepDiveSystem, getNextSystem, getPrevSystem } from '@/data/deepDiveData'; // Adjust path
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { cn } from '@/lib/utils';

export default function DeepDivePage() {
  const router = useRouter();
  const { slug } = useParams();
  const system = getDeepDiveSystem(slug as string);
  const nextSys = getNextSystem(slug as string);
  const prevSys = getPrevSystem(slug as string);

  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const updateScroll = () => {
      const currentScroll = window.scrollY;
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress((currentScroll / scrollHeight) * 100);
    };
    window.addEventListener("scroll", updateScroll);
    return () => window.removeEventListener("scroll", updateScroll);
  }, []);

  if (!system) return <div>System not found</div>;

  return (
    <div className="min-h-screen bg-white">
      {/* Progress Bar */}
      <div className="progress">
        <div className="progress-fill" style={{ width: `${scrollProgress}%` }} />
      </div>

      {/* --- HERO STAGE --- */}
      <section className="stage">
        <div className="split">
          <div className="left" />
          <div className="right" />
        </div>
        
        {/* Animated Blobs */}
        <div className="blob b1" />
        <div className="blob b2" />

        <div className="top">
          <Breadcrumb 
            items={[{ label: 'Systems', href: '/deep-dive' }, { label: system.name, active: true }]} 
            onBack={() => router.back()}
          />
          <div className="navlinks">
            <b>Overview</b>
            <span>Architecture</span>
            <span>Benchmarks</span>
          </div>
          <button className="ham">☰</button>
        </div>

        <div className="content">
          <div className="left-col">
            <div className="eyebrow">{system.eyebrow}</div>
            <h1>{system.name}</h1>
            <div className="actions">
              <button className="read-more">
                <span className="ic">↓</span>
                Read Deep Dive
              </button>
              <a href={system.docsUrl} target="_blank" className="docs-link">Official Docs</a>
            </div>
          </div>

          <div className="mark-col">
             {/* This is the SVG from your snippet */}
            <svg className="mark" viewBox="0 0 220 220" fill="none">
                <circle cx="110" cy="110" r="88" stroke="#15161C" strokeWidth="2" strokeDasharray="4 7" opacity=".25"/>
                <circle cx="110" cy="30" r="11" fill="#00D9A3"/>
                <circle cx="182" cy="70" r="11" fill="#00A87E"/>
                <circle cx="182" cy="150" r="11" fill="#15161C"/>
                <circle cx="110" cy="190" r="11" fill="#00A87E"/>
                <circle cx="38" cy="150" r="11" fill="#00D9A3"/>
                <circle cx="38" cy="70" r="11" fill="#15161C"/>
                <circle cx="110" cy="110" r="16" fill="#FF5A3C"/>
                <path d="M110 30L182 70M182 70L182 150M182 150L110 190M110 190L38 150M38 150L38 70M38 70L110 30" stroke="#15161C" strokeWidth="1.5" opacity=".3"/>
                <path d="M110 110L110 30M110 110L182 70M110 110L182 150M110 110L110 190M110 110L38 150M110 110L38 70" stroke="#FF5A3C" strokeWidth="1.5" opacity=".35"/>
            </svg>
          </div>

          <div className="desc-col">
            {system.description.map((p, i) => (
              <p key={i} className={i > 0 ? "mt-3" : ""}>{p}</p>
            ))}
            <div className="tags">
              {system.tags.map(tag => <span key={tag} className="tag">{tag}</span>)}
            </div>
            <div className="credit">{system.credit} <b>{system.creditOrg}</b></div>
          </div>
        </div>
      </section>

      {/* --- DETAILED ARTICLE SECTION --- */}
      <div className="wrap">
        <section>
          <h2><span className="num">01</span> The Core Architecture</h2>
          <p>
            {system.name} operates on a <b>Distributed Hash Table (DHT)</b> principle. 
            Data is partitioned across nodes using consistent hashing, ensuring that 
            adding or removing nodes doesn't cause massive data reshuffling.
          </p>
          <div className="callout">
            <div className="lbl">Key Insight</div>
            <p>Unlike master-slave architectures, {system.name} uses a "Gossip Protocol" to share state across the cluster.</p>
          </div>
        </section>

        <section>
          <h2><span className="num">02</span> Design Tradeoffs</h2>
          <div className="tradeoff-grid">
            <div className="tog good">
              <div className="k">Strengths</div>
              <ul>
                <li>Linear Scalability</li>
                <li>No Single Point of Failure</li>
                <li>Tunable Consistency</li>
              </ul>
            </div>
            <div className="tog bad">
              <div className="k">Weaknesses</div>
              <ul>
                <li>High Read Latency</li>
                <li>Complex Tombstone management</li>
                <li>Eventual Consistency hurdles</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Navigation Footer */}
        <div className="related">
          <div className="lbl">Continue Reading</div>
          <div className="rel-row">
            {prevSys && (
              <div className="rel-card" onClick={() => router.push(`/deep-dive/${prevSys.slug}`)}>
                <div className="rd">← Previous</div>
                <div className="rn">{prevSys.name}</div>
              </div>
            )}
            {nextSys && (
              <div className="rel-card" onClick={() => router.push(`/deep-dive/${nextSys.slug}`)}>
                <div className="rd">Next Up →</div>
                <div className="rn">{nextSys.name}</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
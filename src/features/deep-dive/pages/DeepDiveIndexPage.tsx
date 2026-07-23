// src/features/deep-dive/pages/DeepDiveIndexPage.tsx

'use client';

import Link from 'next/link';
import { useState } from 'react';
import styles from '@/features/deep-dive/components/DeepDiveIndex.module.css';
import { deepDiveRegistry } from '@/features/deep-dive/data/generated';

interface Topic {
  slug: string;
  name: string;
  description: string;
  tags: string[];
  category: string;
  readTime: string;
  mark: React.ReactNode;
}

const TOPICS: Topic[] = deepDiveRegistry.map((item) => {
  const descText = Array.isArray(item.description)
    ? item.description.join(' ')
    : item.description;

  return {
    slug: item.slug,
    name: item.name,
    description: descText.replace(/<[^>]*>/g, ''),
    tags: item.tags,
    category: 'db',
    readTime: '10 min',
    mark: null,
  };
});

export function DeepDiveIndexPage() {
  const [filter, setFilter] = useState('all');

  const filteredTopics = filter === 'all' 
    ? TOPICS 
    : TOPICS.filter(t => t.category === filter);

  const getMarkSvg = (slug: string) => {
    // Return SVG marks based on slug from HTML design
    const marks: Record<string, React.ReactNode> = {
      cassandra: (
        <>
          <circle cx="28" cy="8" r="4" fill="#00D9A3"/>
          <circle cx="46" cy="19" r="4" fill="#00A87E"/>
          <circle cx="46" cy="37" r="4" fill="#15161C"/>
          <circle cx="28" cy="48" r="4" fill="#00A87E"/>
          <circle cx="10" cy="37" r="4" fill="#00D9A3"/>
          <circle cx="10" cy="19" r="4" fill="#15161C"/>
          <circle cx="28" cy="28" r="6" fill="#FF5A3C"/>
          <circle cx="28" cy="28" r="24" stroke="#15161C" strokeWidth="1" strokeDasharray="3 4" opacity=".2" fill="none"/>
        </>
      ),
      redis: (
        <>
          <circle cx="28" cy="28" r="9" fill="#FF5A3C"/>
          <circle cx="10" cy="14" r="3.5" fill="#00D9A3"/>
          <circle cx="46" cy="14" r="3.5" fill="#00A87E"/>
          <circle cx="10" cy="42" r="3.5" fill="#15161C"/>
          <circle cx="46" cy="42" r="3.5" fill="#00A87E"/>
          <path d="M28 28L10 14M28 28L46 14M28 28L10 42M28 28L46 42" stroke="#15161C" strokeWidth="1" opacity=".25"/>
        </>
      ),
      dynamodb: (
        <>
          <rect x="12" y="12" width="32" height="32" rx="6" stroke="#6A5AE0" strokeWidth="2" fill="none"/>
          <line x1="12" y1="24" x2="44" y2="24" stroke="#6A5AE0" strokeWidth="1.5" opacity=".5"/>
          <line x1="12" y1="34" x2="44" y2="34" stroke="#6A5AE0" strokeWidth="1.5" opacity=".5"/>
          <line x1="24" y1="12" x2="24" y2="44" stroke="#6A5AE0" strokeWidth="1.5" opacity=".5"/>
          <circle cx="24" cy="24" r="3" fill="#FF5A3C"/>
        </>
      ),
      postgres: (
        <>
          <circle cx="28" cy="10" r="4" fill="#15161C"/>
          <circle cx="14" cy="26" r="4" fill="#00A87E"/>
          <circle cx="42" cy="26" r="4" fill="#00A87E"/>
          <circle cx="8" cy="44" r="3.5" fill="#00D9A3"/>
          <circle cx="20" cy="44" r="3.5" fill="#00D9A3"/>
          <circle cx="36" cy="44" r="3.5" fill="#00D9A3"/>
          <circle cx="48" cy="44" r="3.5" fill="#00D9A3"/>
          <path d="M28 10L14 26M28 10L42 26M14 26L8 44M14 26L20 44M42 26L36 44M42 26L48 44" stroke="#15161C" strokeWidth="1" opacity=".3"/>
        </>
      ),
      mongodb: (
  <>
    <rect x="14" y="10" width="28" height="36" rx="4" fill="#F6F6F4" stroke="#15161C" strokeWidth="1.5"/>
    <line x1="20" y1="20" x2="34" y2="20" stroke="#15161C" strokeWidth="1.5" opacity=".5"/>
    <line x1="20" y1="27" x2="30" y2="27" stroke="#15161C" strokeWidth="1.5" opacity=".5"/>
    <line x1="20" y1="34" x2="36" y2="34" stroke="#15161C" strokeWidth="1.5" opacity=".5"/>
    <circle cx="30" cy="27" r="4" fill="#00D9A3"/>
  </>
),
      kafka: (
        <>
          <rect x="8" y="12" width="40" height="7" rx="2" fill="#E8940A"/>
          <rect x="8" y="24" width="40" height="7" rx="2" fill="#E8940A" opacity=".7"/>
          <rect x="8" y="36" width="40" height="7" rx="2" fill="#E8940A" opacity=".4"/>
          <circle cx="34" cy="15.5" r="2.2" fill="#15161C"/>
          <circle cx="20" cy="27.5" r="2.2" fill="#15161C"/>
          <circle cx="40" cy="39.5" r="2.2" fill="#15161C"/>
        </>
      ),
      'consistent-hashing': (
        <>
          <circle cx="28" cy="8" r="3.5" fill="#00D9A3"/>
          <circle cx="44" cy="20" r="3.5" fill="#FF5A3C"/>
          <circle cx="38" cy="42" r="3.5" fill="#00A87E"/>
          <circle cx="16" cy="44" r="3.5" fill="#6A5AE0"/>
          <circle cx="9" cy="18" r="3.5" fill="#00A87E"/>
          <circle cx="28" cy="8" r="20" stroke="#15161C" strokeWidth="1.5" fill="none" opacity=".2" transform="translate(0,12)"/>
        </>
      ),
    };
    return marks[slug] || null;
  };

  return (
    <div style={{ background: 'var(--landing-bg)', minHeight: '100vh' }}>
      <div className={styles.wrap}>
        <nav className={styles.navBar}>
          <div className={styles.navlinks}>
            <Link href="/learn">About Learn</Link>
            <b>Deep Dives</b>
            <Link href="/library">Library</Link>
          </div>
          <button className={styles.ham}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          </button>
        </nav>

        <div className={styles.header}>
          <div className={styles.eyebrow}>DEEP DIVES</div>
          <h1>What do you want to go deep on?</h1>
          <p>Seven building blocks, explained the way you'd actually want to explain them in an interview &mdash; not just what they do, but why they're shaped that way.</p>
        </div>

        <div className={styles.filters}>
          <button 
            className={`${styles.fpill} ${filter === 'all' ? styles.active : ''}`}
            onClick={() => setFilter('all')}
          >
            All
          </button>
          <button 
            className={`${styles.fpill} ${filter === 'db' ? styles.active : ''}`}
            onClick={() => setFilter('db')}
          >
            Databases
          </button>
          <button 
            className={`${styles.fpill} ${filter === 'msg' ? styles.active : ''}`}
            onClick={() => setFilter('msg')}
          >
            Messaging
          </button>
          <button 
            className={`${styles.fpill} ${filter === 'concept' ? styles.active : ''}`}
            onClick={() => setFilter('concept')}
          >
            Core concepts
          </button>
        </div>

        <div className={styles.grid}>
          {filteredTopics.map((topic) => (
            <Link key={topic.slug} href={`/deep-dive/${topic.slug}`} className={styles.card}>
              <svg className={styles.mark} viewBox="0 0 56 56" fill="none">
                {getMarkSvg(topic.slug)}
              </svg>
              <h3>{topic.name}</h3>
              <div className={styles.oneLiner}>{topic.description}</div>
              <div className={styles.cardFoot}>
                <div className={styles.tags}>
                  {topic.tags.map((tag) => (
                    <span key={tag} className={styles.tag}>{tag}</span>
                  ))}
                </div>
                <div className={styles.read}>{topic.readTime}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

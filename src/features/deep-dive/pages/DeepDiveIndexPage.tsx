// src/features/deep-dive/pages/DeepDiveIndexPage.tsx

'use client';

import Link from 'next/link';
import { useState } from 'react';
import styles from '@/features/deep-dive/components/DeepDiveIndex.module.css';
import { deepDiveRegistry } from '@/content/deep-dive';


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
  const descText = item.description;

  return {
    slug: item.slug,
    name: item.name,
    description: descText.replace(/<[^>]*>/g, ""),
    tags: item.tags,
    category: item.category,
    readTime: item.readTime,
    mark: item.heroIllustration ? <item.heroIllustration /> : null,
  };
});

export function DeepDiveIndexPage() {
  const [filter, setFilter] = useState('all');

  const filteredTopics = filter === 'all' 
    ? TOPICS 
    : TOPICS.filter(t => t.category === filter);


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
                {topic.mark}
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

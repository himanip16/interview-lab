// src/features/deep-dive/pages/DeepDiveIndexPage.tsx

'use client';

import Link from 'next/link';
import { useState } from 'react';
import type { ReactNode } from 'react';
import styles from '@/features/deep-dive/components/DeepDiveIndex.module.css';
import { contentComponents } from '@/content/deep-dive/component-registry';
import { deepDiveRegistry } from '@/content/deep-dive';
import "@/features/deep-dive/styles/deep-dive.css";
import type { DeepDiveCategory } from '@/features/deep-dive/types';

interface Topic {
  slug: string;
  name: string;
  description: string;
  tags: string[];
  category: DeepDiveCategory;
  readTime: string;
  mark: ReactNode;
}

const TOPICS: Topic[] = deepDiveRegistry.map((item) => {
  const { metadata } = item;

  const Hero =
    item.heroDiagram?.renderEngine === 'component'
      ? contentComponents[item.heroDiagram.componentName]
      : null;

  return {
    slug: metadata.slug,
    name: metadata.name,
    description: metadata.description,
    tags: metadata.tags,
    category: metadata.category,
    readTime: `${metadata.estimatedReadingMinutes} min read`,
    mark: Hero ? <Hero /> : null,
  };
});

export function DeepDiveIndexPage() {
  const [filter, setFilter] = useState('all');

  const filteredTopics =
    filter === 'all' ? TOPICS : TOPICS.filter((t) => t.category === filter);

  return (
    <div style={{ background: 'var(--landing-bg)', minHeight: '100vh' }}>
      <div className={styles.wrap}>
        <div className={styles.header}>
          <div className={styles.eyebrow}>DEEP DIVES</div>
          <h1>What do you want to go deep on?</h1>
          <p>Seven building blocks, explained the way you'd actually want to explain them in an interview &mdash; not just what they do, but why they're shaped that way.</p>
        </div>

        <div className={styles.filters}>
          <button className={`${styles.fpill} ${filter === 'all' ? styles.fpillActive : ''}`} onClick={() => setFilter('all')}>
            All
          </button>
          <button className={`${styles.fpill} ${filter === 'db' ? styles.fpillActive : ''}`} onClick={() => setFilter('db')}>
            Databases
          </button>
          <button className={`${styles.fpill} ${filter === 'msg' ? styles.fpillActive : ''}`} onClick={() => setFilter('msg')}>
            Messaging
          </button>
          <button className={`${styles.fpill} ${filter === 'concept' ? styles.fpillActive : ''}`} onClick={() => setFilter('concept')}>
            Core concepts
          </button>
        </div>

        <div className={styles.grid}>
          {filteredTopics.map((topic) => (
            <Link
              key={topic.slug}
              href={`/deep-dive/${topic.slug}`}
              className={styles.card}
            >
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
// src/features/deep-dive/pages/DeepDiveIndexPage.tsx

'use client';

import Link from 'next/link';
import { useState } from 'react';
import type { ReactNode } from 'react';
import { Card, FilterPill, Tag } from '@/shared/components';
import styles from '@/features/deep-dive/components/DeepDiveIndex.module.css';
import { deepDiveRegistry } from '@/content/deep-dive';
import { contentComponents } from '@/content/deep-dive/component-registry';
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
          <FilterPill active={filter === 'all'} onClick={() => setFilter('all')}>
            All
          </FilterPill>
          <FilterPill active={filter === 'db'} onClick={() => setFilter('db')}>
            Databases
          </FilterPill>
          <FilterPill active={filter === 'msg'} onClick={() => setFilter('msg')}>
            Messaging
          </FilterPill>
          <FilterPill active={filter === 'concept'} onClick={() => setFilter('concept')}>
            Core concepts
          </FilterPill>
        </div>

        <div className={styles.grid}>
          {filteredTopics.map((topic) => (
            <Card
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
                    <Tag key={tag} size="sm">{tag}</Tag>
                  ))}
                </div>
                <div className={styles.read}>{topic.readTime}</div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
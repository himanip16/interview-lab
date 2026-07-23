// content/deep-dive/index.ts
//
// NOTE: page.tsx already imports `getDeepDiveBySlug` and `getPreviousAndNext`
// from '@/content/deep-dive'. I haven't seen your existing version of this
// file, so this is a best-guess reconstruction of that shape — if your real
// one has more fields or logic, merge rather than overwrite wholesale.

import { DeepDiveArticle } from '@/features/deep-dive/types';
import { cassandraData } from './cassandra';
import { dynamodbData } from './dynamodb';
import { consistentHashingData } from './consistent-hashing';

export const deepDiveRegistry: DeepDiveArticle[] = [
  cassandraData,
  dynamodbData,
  consistentHashingData,
];

export function getAllDeepDives(): DeepDiveArticle[] {
  return deepDiveRegistry;
}

export function getDeepDiveBySlug(slug: string): DeepDiveArticle | undefined {
  return deepDiveRegistry.find((article) => article.slug === slug);
}

export function getPreviousAndNext(slug: string): {
  previous: DeepDiveArticle | null;
  next: DeepDiveArticle | null;
} {
  const index = deepDiveRegistry.findIndex((article) => article.slug === slug);
  if (index === -1) return { previous: null, next: null };

  return {
    previous: index > 0 ? deepDiveRegistry[index - 1] : null,
    next: index < deepDiveRegistry.length - 1 ? deepDiveRegistry[index + 1] : null,
  };
}

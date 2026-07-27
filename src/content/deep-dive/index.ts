// src/content/deep-dive/index.ts

import { deepDiveRegistry } from './generated';
import type { DeepDiveArticle } from '@/features/deep-dive/types';

export { deepDiveRegistry };

export function getAllDeepDives(): DeepDiveArticle[] {
  return deepDiveRegistry;
}

export function getDeepDiveBySlug(slug: string): DeepDiveArticle | undefined {
  return deepDiveRegistry.find(
    (article) => article.metadata.slug === slug
  );
}

export function getPreviousAndNext(slug: string) {
  const index = deepDiveRegistry.findIndex(
    (article) => article.metadata.slug === slug
  );

  return {
    previous: index > 0 ? deepDiveRegistry[index - 1] : null,
    next:
      index >= 0 && index < deepDiveRegistry.length - 1
        ? deepDiveRegistry[index + 1]
        : null,
  };
}
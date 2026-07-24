// src/content/deep-dive/index.ts

import { deepDiveRegistry } from './generated';

export { deepDiveRegistry };

export function getAllDeepDives() {
  return deepDiveRegistry;
}

export function getDeepDiveBySlug(slug: string) {
  return deepDiveRegistry.find(article => article.slug === slug);
}

export function getPreviousAndNext(slug: string) {
  const index = deepDiveRegistry.findIndex(
    article => article.slug === slug
  );

  return {
    previous: index > 0 ? deepDiveRegistry[index - 1] : null,
    next:
      index >= 0 && index < deepDiveRegistry.length - 1
        ? deepDiveRegistry[index + 1]
        : null,
  };
}
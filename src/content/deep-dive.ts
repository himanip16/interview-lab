import { DeepDiveArticle } from '@/features/deep-dive/types';

// This is a placeholder implementation. In a real application, you would:
// 1. Load deep-dive content from markdown files or a CMS
// 2. Parse and transform the content into the DeepDiveArticle format
// 3. Cache the results for performance

const deepDiveArticles: Record<string, DeepDiveArticle> = {};

export function getDeepDiveBySlug(slug: string): DeepDiveArticle | undefined {
  return deepDiveArticles[slug];
}

export function getPreviousAndNext(slug: string): { previous?: DeepDiveArticle; next?: DeepDiveArticle } {
  const slugs = Object.keys(deepDiveArticles);
  const index = slugs.indexOf(slug);
  
  if (index === -1) {
    return { previous: undefined, next: undefined };
  }
  
  return {
    previous: index > 0 ? deepDiveArticles[slugs[index - 1]] : undefined,
    next: index < slugs.length - 1 ? deepDiveArticles[slugs[index + 1]] : undefined,
  };
}

export function getAllDeepDives(): DeepDiveArticle[] {
  return Object.values(deepDiveArticles);
}

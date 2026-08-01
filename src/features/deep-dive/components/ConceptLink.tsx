// src/features/deep-dive/components/ConceptLink.tsx

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ConceptHoverPopover } from './ConceptHoverPopover';
import { getDeepDiveBySlug } from '@/content/deep-dive';
import type { DeepDiveArticle } from '@/features/deep-dive/types';

interface ConceptLinkProps {
  slug: string;
  text: string;
}

export function ConceptLink({ slug, text }: ConceptLinkProps) {
  const [article, setArticle] = useState<DeepDiveArticle | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const data = getDeepDiveBySlug(slug);
        setArticle(data ?? null);
      } catch (error) {
        console.error(`Failed to fetch article for ${slug}:`, error);
        setArticle(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticle();
  }, [slug]);

  if (isLoading || !article) {
    // Fallback to simple link while loading or if article not found
    return (
      <Link href={`/deep-dive/${slug}`} className="content-link" data-category="concept">
        {text}
      </Link>
    );
  }

  return (
    <Link
      href={`/deep-dive/${slug}`}
      className="content-link"
      data-category={article.metadata.category}
    >
      {text}
      <ConceptHoverPopover article={article} />
    </Link>
  );
}

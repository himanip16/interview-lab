// src/features/deep-dive/components/ContentRenderer.tsx

'use client';

import Link from 'next/link';
import { ContentBlock, Paragraph } from '@/features/deep-dive/types';

function resolveHref(href: NonNullable<ContentBlock['href']>): string {
  switch (href.type) {
    case 'deep-dive':
      return `/deep-dive/${href.target}`;
    case 'transcript':
      return `/transcripts/${href.target}`;
    case 'external':
      return href.target;
  }
}

function ContentSpan({ block, keyPrefix }: { block: ContentBlock; keyPrefix: string }) {
  if (block.type === 'link' && block.href) {
    const isExternal = block.href.type === 'external';
    const href = resolveHref(block.href);

    const linkBody = (
      <>
        {block.text}
        {block.href.preview && (
          <span className="content-link-preview">
            {block.href.preview}
            <span className="cta">
              {block.href.type === 'external' ? 'Open source' : 'View deep dive'}
            </span>
          </span>
        )}
      </>
    );

    if (isExternal) {
      return (
        <a
          key={keyPrefix}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="content-link"
        >
          {linkBody}
        </a>
      );
    }

    return (
      <Link key={keyPrefix} href={href} className="content-link">
        {linkBody}
      </Link>
    );
  }

  if (block.bold) {
    return <b key={keyPrefix}>{block.text}</b>;
  }

  return <span key={keyPrefix}>{block.text}</span>;
}

/** Renders a single paragraph's worth of spans inline, without a wrapping <p>. */
export function InlineContent({ paragraph }: { paragraph: Paragraph }) {
  return (
    <>
      {paragraph.map((block, i) => (
        <ContentSpan key={i} block={block} keyPrefix={`span-${i}`} />
      ))}
    </>
  );
}

/** Renders a full content array (one or more paragraphs) as <p> tags. */
export function ContentRenderer({ content }: { content: Paragraph[] }) {
  return (
    <>
      {content.map((paragraph, i) => (
        <p key={i}>
          <InlineContent paragraph={paragraph} />
        </p>
      ))}
    </>
  );
}
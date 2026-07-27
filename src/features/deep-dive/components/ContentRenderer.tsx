// src/features/deep-dive/components/ContentRenderer.tsx

'use client';

import Link from 'next/link';
import { ParagraphBlock, InlineContent, InlineLink } from '@/features/deep-dive/types';

function resolveHref(href: NonNullable<InlineLink['ref']>): string {
  switch (href.kind) {
    case 'deep-dive':
      return `/deep-dive/${href.target}`;
    case 'transcript':
      return `/transcripts/${href.target}`;
    case 'external':
      return href.target;
  }
}

function ContentSpan({ block, keyPrefix }: { block: InlineContent; keyPrefix: string }) {
  if (block.type === 'link') {
    const isExternal = block.ref.kind === 'external';
    const href = resolveHref(block.ref);

    const linkBody = (
      <>
        {block.text}
        {block.ref.preview && (
          <span className="content-link-preview">
            {block.ref.preview}
            <span className="cta">
              {block.ref.kind === 'external' ? 'Open source' : 'View deep dive'}
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

  if (block.type === 'bold') {
    return <b key={keyPrefix}>{block.text}</b>;
  }

  if (block.type === 'italic') {
    return <i key={keyPrefix}>{block.text}</i>;
  }

  if (block.type === 'code') {
    return <code key={keyPrefix}>{block.text}</code>;
  }

  return <span key={keyPrefix}>{block.text}</span>;
}

/** Renders a single paragraph's worth of spans inline, without a wrapping <p>. */
export function InlineContentRenderer({ content }: { content: InlineContent[] }) {
  return (
    <>
      {content.map((block, i) => (
        <ContentSpan key={i} block={block} keyPrefix={`span-${i}`} />
      ))}
    </>
  );
}

/** Renders a full content array (one or more paragraphs) as <p> tags. */
export function ContentRenderer({ content }: { content: ParagraphBlock[] }) {
  return (
    <>
      {content.map((paragraphBlock, i) => (
        <p key={i}>
          <InlineContentRenderer content={paragraphBlock.content} />
        </p>
      ))}
    </>
  );
}
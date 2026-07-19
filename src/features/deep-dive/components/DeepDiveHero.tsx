import { ReactNode } from 'react';
import Link from 'next/link';

interface DeepDiveHeroProps {
  eyebrow: string;
  title: string;
  slug: string;
  description: string[];
  tags: string[];
  credit: string;
  creditOrg: string;
  illustration: ReactNode;
  docsUrl?: string;
}

export function DeepDiveHero({
  eyebrow,
  title,
  slug,
  description,
  tags,
  credit,
  creditOrg,
  illustration,
  docsUrl
}: DeepDiveHeroProps) {
  return (
    <>
      <div className="left-col">
        <div className="eyebrow">{eyebrow}</div>
        <h1>{title}</h1>
        <div className="actions">
          <Link href={`/deep-dive/${slug}`} className="read-more">
            <div className="ic">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </div>
            READ MORE
          </Link>
          {docsUrl && (
            <a href={docsUrl} target="_blank" rel="noopener noreferrer" className="docs-link">
              Official docs
            </a>
          )}
        </div>
      </div>

      <div className="mark-col">
        {illustration}
      </div>

      <div className="desc-col">
        {description.map((paragraph, index) => (
          <p key={index} style={index > 0 ? { marginTop: '12px' } : undefined} dangerouslySetInnerHTML={{ __html: paragraph }} />
        ))}
        <div className="tags">
          {tags.map((tag) => (
            <span key={tag} className="tag">{tag}</span>
          ))}
        </div>
        <div className="credit">
          {credit} <b>{creditOrg}</b>
        </div>
      </div>
    </>
  );
}

// src/features/deep-dive/components/DeepDiveHero.tsx

import { ReactNode } from "react";
import Link from "next/link";

interface DeepDiveHeroProps {
  systemName: string;
  systemSlug: string;
  category: string;
  eyebrow: string;

  description: ReactNode[];

  tags: string[];

  creditOrg: string;

  diagramSvg: ReactNode;

  docsUrl?: string;
}

export function DeepDiveHero({
  systemName,
  systemSlug,
  category,
  eyebrow,
  description,
  tags,
  creditOrg,
  diagramSvg,
  docsUrl,
}: DeepDiveHeroProps) {
  return (
    <>
      <div className="left-col">
        <div className="eyebrow">{eyebrow}</div>

        <h1>{systemName}</h1>

        <p className="category">{category}</p>

        <div className="actions">
          <Link
            href={`/deep-dive/${systemSlug}`}
            className="read-more"
          >
            <div className="ic">
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
              >
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </div>

            READ MORE
          </Link>

          {docsUrl && (
            <a
              href={docsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="docs-link"
            >
              Official docs
            </a>
          )}
        </div>
      </div>

      <div className="mark-col">
        {diagramSvg}
      </div>

      <div className="desc-col">
        {description.map((paragraph, index) => (
          <p
            key={index}
            style={index > 0 ? { marginTop: "12px" } : undefined}
          >
            {paragraph}
          </p>
        ))}

        <div className="tags">
          {tags.map((tag) => (
            <span key={tag} className="tag">
              {tag}
            </span>
          ))}
        </div>

        <div className="credit">
          Maintained by <b>{creditOrg}</b>
        </div>
      </div>
    </>
  );
}
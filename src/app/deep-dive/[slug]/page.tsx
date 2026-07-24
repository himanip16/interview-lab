// src/app/deep-dive/[slug]/page.tsx

import { notFound } from "next/navigation";
import Link from "next/link";

import { SectionHeading } from "@/features/deep-dive/components/SectionHeading";
import { Callout } from "@/features/deep-dive/components/Callout";
import { ContentRenderer } from "@/features/deep-dive/components/ContentRenderer";
import { TradeoffComparison } from "@/features/deep-dive/components/TradeoffComparison";
import { RelatedTechnologyCard } from "@/features/deep-dive/components/RelatedTechnologyCard";
import { Tag } from "@/features/deep-dive/components/Tag";
import { ThemeToggle } from "@/features/deep-dive/components/ThemeToggle";
import { VideoBlock } from "@/features/deep-dive/components/VideoBlock";
import { IllustrationBlock } from "@/features/deep-dive/components/IllustrationBlock";
import { ResourceRow } from "@/features/deep-dive/components/ResourceRow";

import {
  getDeepDiveBySlug,
  getPreviousAndNext,
} from "@/content/deep-dive";

import { contentComponents } from "@/content/deep-dive/component-registry";

import "@/features/deep-dive/styles/deep-dive.css";

import type { ReactNode } from "react";

import {
  BookOpen,
  MessageSquare,
  Code2,
  ChevronLeft,
} from "lucide-react";
import CodeBlock from "@/shared/code/CodeBlock";
type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

// --- Content shape types -----------------------------------------------
// Derived directly from the real return type of `getDeepDiveBySlug`
// instead of hand-written duplicates, so these can never drift out of
// sync with the actual content shape (e.g. `callout.content` being
// `Paragraph[]` rather than `string`).

type Article = NonNullable<ReturnType<typeof getDeepDiveBySlug>>;
type DeepDiveSection = Article["sections"][number];
type Resource = NonNullable<DeepDiveSection["resources"]>[number];
type RelatedArticle = Article["related"][number];

type IconKey = keyof typeof iconMap;

const iconMap: Record<string, ReactNode> = {
  book: <BookOpen size={18} />,
  message: <MessageSquare size={18} />,
  code: <Code2 size={18} />,
};

/**
 * Sanitize HTML before rendering with dangerouslySetInnerHTML.
 * Content here may originate from a CMS or other semi-trusted source,
 * so we strip anything that isn't plain formatting markup.
 */
function sanitize(html: string): string {
  return html
    .replace(/<script.*?>.*?<\/script>/gi, "")
    .replace(/on\w+=".*?"/gi, "")
    .replace(/javascript:/gi, "");
}

export default async function DeepDiveArticlePage({
  params,
}: PageProps) {
  const { slug } = await params;

  const article = getDeepDiveBySlug(slug);

  if (!article) {
    notFound();
  }

  const { previous, next } = getPreviousAndNext(slug);

  const HeroIllustration = article.heroIllustration;

  return (
    <div className="wrap">
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: 20,
        }}
      >
        <ThemeToggle />
      </div>

      <div className="crumb">
        <Link href="/deep-dive" className="back">
          <ChevronLeft size={14} />
        </Link>

        Deep dives&nbsp;/&nbsp;
        <b>{article.name}</b>
      </div>

      {HeroIllustration && (
        <div
          className="mark-sm"
          style={{
            width: 56,
            height: 56,
            marginBottom: 16,
          }}
        >
          <HeroIllustration />
        </div>
      )}

      <h1 className="title">{article.title}</h1>

      <div className="tags">
        {article.tags.map((tag: string) => (
          <Tag key={tag}>{tag}</Tag>
        ))}
      </div>

      <p
        className="lede"
        dangerouslySetInnerHTML={{
          __html: sanitize(article.lede),
        }}
      />

      {article.sections.map((section: DeepDiveSection) => (
        <section key={section.number}>
          <div className="h2row">
            <SectionHeading number={section.number}>
              {section.title}
            </SectionHeading>
          </div>

          <ContentRenderer content={section.content} />

          {section.illustration && (() => {
            const Illustration =
              contentComponents[section.illustration.component];

            return (
              <IllustrationBlock
                illustration={Illustration ? <Illustration /> : null}
                caption={section.illustration.caption}
                width={section.illustration.width}
              >
                {section.illustration.text && (
                  <p
                    dangerouslySetInnerHTML={{
                      __html: sanitize(section.illustration.text),
                    }}
                  />
                )}
              </IllustrationBlock>
            );
          })()}

          {section.video && (
            <VideoBlock
              caption={section.video.caption}
              duration={section.video.duration}
            />
          )}

          {section.code && (
            <CodeBlock code={section.code} />
          )}

          {section.callout && (
            <Callout
              label={section.callout.label}
              content={section.callout.content}
            />
          )}

          {section.resources && (
            <div className="resources">
              {section.resources.map(
                (resource: Resource, index: number) => (
                  <ResourceRow
                    key={index}
                    icon={iconMap[resource.icon as IconKey] ?? null}
                    title={resource.title}
                    subtitle={resource.subtitle}
                    chips={resource.chips}
                  />
                )
              )}
            </div>
          )}
        </section>
      ))}

      {article.tradeoffs && (
        <section>
          <SectionHeading number={article.sections.length + 1}>
            When to reach for it — and when not to
          </SectionHeading>

          <TradeoffComparison
            strengths={article.tradeoffs.strengths}
            weaknesses={article.tradeoffs.weaknesses}
          />
        </section>
      )}

      {article.related.length > 0 && (
        <div className="related">
          <div className="lbl">Continue the thread</div>

          <div className="rel-row">
            {article.related.map((related: RelatedArticle) => (
              <Link
                key={related.slug}
                href={`/deep-dive/${related.slug}`}
              >
                <RelatedTechnologyCard
                  name={related.name}
                  description={related.description}
                />
              </Link>
            ))}
          </div>
        </div>
      )}

      {(previous || next) && (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: 64,
            gap: 16,
          }}
        >
          <div>
            {previous && (
              <Link href={`/deep-dive/${previous.slug}`}>
                ← {previous.name}
              </Link>
            )}
          </div>

          <div>
            {next && (
              <Link href={`/deep-dive/${next.slug}`}>
                {next.name} →
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
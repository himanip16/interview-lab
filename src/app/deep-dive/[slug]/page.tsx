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
import { CodeBlock } from "@/features/deep-dive/components/CodeBlock";
import { IllustrationBlock } from "@/features/deep-dive/components/IllustrationBlock";
import { ResourceRow } from "@/features/deep-dive/components/ResourceRow";

import {
  getDeepDiveBySlug,
  getPreviousAndNext,
} from "@/content/deep-dive";

import { heroIllustrations } from "@/content/deep-dive/illustration-registry";
import { contentComponents } from "@/content/deep-dive/component-registry";

import "@/features/deep-dive/styles/deep-dive.css";

import {
  BookOpen,
  MessageSquare,
  Code2,
  ChevronLeft,
} from "lucide-react";

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

const iconMap: Record<string, React.ReactNode> = {
  book: <BookOpen size={18} />,
  message: <MessageSquare size={18} />,
  code: <Code2 size={18} />,
};

export default async function DeepDiveArticlePage({
  params,
}: PageProps) {
  const { slug } = await params;

  const article = getDeepDiveBySlug(slug);

  if (!article) {
    notFound();
  }

  const { previous, next } = getPreviousAndNext(slug);

  const heroIllustration = heroIllustrations[slug] ?? null;

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

      {heroIllustration && (
        <div
          className="mark-sm"
          style={{
            width: 56,
            height: 56,
            marginBottom: 16,
          }}
        >
          {heroIllustration}
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
          __html: article.lede,
        }}
      />

      {article.sections.map((section: any) => (
        <section key={section.number}>
          <div className="h2row">
            <SectionHeading number={section.number}>
              {section.title}
            </SectionHeading>
          </div>

          <ContentRenderer content={section.content} />

          {section.illustration && (
            <IllustrationBlock
              illustration={
                contentComponents[
                  section.illustration.component
                ] ?? null
              }
              caption={section.illustration.caption}
              width={section.illustration.width}
            >
              {section.illustration.text && (
                <p
                  dangerouslySetInnerHTML={{
                    __html: section.illustration.text,
                  }}
                />
              )}
            </IllustrationBlock>
          )}

          {section.video && (
            <VideoBlock
              caption={section.video.caption}
              duration={section.video.duration}
            />
          )}

          {section.code && (
            <CodeBlock>{section.code}</CodeBlock>
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
                (resource: any, index: number) => (
                  <ResourceRow
                    key={index}
                    icon={iconMap[resource.icon] ?? null}
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
            {article.related.map((related: any) => (
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
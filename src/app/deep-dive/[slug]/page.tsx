// src/app/deep-dive/[slug]/page.tsx

import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ProgressBar } from '@/features/deep-dive/components/ProgressBar';
import { Breadcrumb } from '@/features/deep-dive/components/Breadcrumb';
import { SectionHeading } from '@/features/deep-dive/components/SectionHeading';
import { Callout } from '@/features/deep-dive/components/Callout';
import { ContentRenderer } from '@/features/deep-dive/components/ContentRenderer';
import { TradeoffComparison } from '@/features/deep-dive/components/TradeoffComparison';
import { RelatedTechnologyCard } from '@/features/deep-dive/components/RelatedTechnologyCard';
import { Tag } from '@/features/deep-dive/components/Tag';
import { ThemeToggle } from '@/features/deep-dive/components/ThemeToggle';
import { VideoBlock } from '@/features/deep-dive/components/VideoBlock';
import { CodeBlock } from '@/features/deep-dive/components/CodeBlock';
import { IllustrationBlock } from '@/features/deep-dive/components/IllustrationBlock';
import { ResourceRow } from '@/features/deep-dive/components/ResourceRow';
import { CassandraIllustration } from '@/content/deep-dive/illustrations/Cassandra';
import { RedisIllustration } from '@/content/deep-dive/illustrations/Redis';
import { KafkaIllustration } from '@/content/deep-dive/illustrations/Kafka';
import { PostgresIllustration } from '@/content/deep-dive/illustrations/Postgres';
import { DynamoDBIllustration } from '@/content/deep-dive/illustrations/DynamoDB';
import { MongoDBIllustration } from '@/content/deep-dive/illustrations/MongoDB';
import { ConsistentHashingIllustration } from '@/content/deep-dive/illustrations/ConsistentHashing';
import { ModuloIllustration } from '@/content/deep-dive/illustrations/ModuloIllustration';
import { ConsistentHashingHero } from '@/content/deep-dive/illustrations/ConsistentHashingHero';
import { getDeepDiveBySlug, getPreviousAndNext } from '@/content/deep-dive';
import '@/features/deep-dive/styles/deep-dive.css';

const illustrationMap: Record<string, React.ReactNode> = {
  cassandra: <CassandraIllustration />,
  redis: <RedisIllustration />,
  kafka: <KafkaIllustration />,
  postgres: <PostgresIllustration />,
  dynamodb: <DynamoDBIllustration />,
  mongodb: <MongoDBIllustration />,
  'consistent-hashing': <ConsistentHashingHero />
};

const componentMap: Record<string, React.ReactNode> = {
  ModuloIllustration: <ModuloIllustration />,
  ConsistentHashingIllustration: <ConsistentHashingIllustration />
};

const iconMap: Record<string, React.ReactNode> = {
  book: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 19.5A2.5 2.5 0 016.5 17H20M4 4.5A2.5 2.5 0 016.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15z"/>
    </svg>
  ),
  message: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"/>
    </svg>
  ),
  code: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M8 9l-4 3 4 3M16 9l4 3-4 3M13 5l-3 14"/>
    </svg>
  )
};

export default async function DeepDiveArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = getDeepDiveBySlug(slug);
  const { previous, next } = getPreviousAndNext(slug);

  if (!article) {
    notFound();
  }

  const illustration = illustrationMap[slug] || <CassandraIllustration />;

  return (
    <>
      <ProgressBar />

      <div className="wrap">
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
          <ThemeToggle />
        </div>
        <div className="crumb">
          <Link href="/deep-dive" className="back">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
              <path d="M15 6l-6 6 6 6" />
            </svg>
          </Link>
          Deep dives &nbsp;/&nbsp; <b>{article.name}</b>
        </div>

        <div className="mark-sm" style={{ width: '56px', height: '56px', marginBottom: '16px' }}>
          {illustration}
        </div>

        <h1 className="title">{article.title}</h1>
        <div className="tags">
          {article.tags.map((tag: string) => (
            <Tag key={tag}>{tag}</Tag>
          ))}
        </div>

        <p className="lede" dangerouslySetInnerHTML={{ __html: article.lede }} />

        {article.sections.map((section: any) => (
          <section key={section.number}>
            <div className="h2row">
              <SectionHeading number={section.number}>{section.title}</SectionHeading>
            </div>

            {/* section.content is now Paragraph[] (arrays of {type, text, bold?, href?} spans),
                not raw HTML strings — ContentRenderer turns each paragraph into a <p> and each
                span into text, bold text, or a hoverable link. */}
            <ContentRenderer content={section.content} />

            {section.illustration && (
              <IllustrationBlock
                illustration={componentMap[section.illustration.component] || null}
                caption={section.illustration.caption}
                width={section.illustration.width}
              >
                {section.illustration.text && <p dangerouslySetInnerHTML={{ __html: section.illustration.text }} />}
              </IllustrationBlock>
            )}
            {section.video && (
              <VideoBlock caption={section.video.caption} duration={section.video.duration} />
            )}
            {section.code && <CodeBlock>{section.code}</CodeBlock>}
            {section.callout && (
              <Callout label={section.callout.label} content={section.callout.content} />
            )}
            {section.resources && (
              <div className="resources">
                {section.resources.map((resource: any, index: number) => (
                  <ResourceRow
                    key={index}
                    icon={iconMap[resource.icon] || null}
                    title={resource.title}
                    subtitle={resource.subtitle}
                    chips={resource.chips}
                  />
                ))}
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

        <div className="related">
          <div className="lbl">Continue the thread</div>
          <div className="rel-row">
            {article.related.map((related: any) => (
              <Link key={related.slug} href={`/deep-dive/${related.slug}`}>
                <RelatedTechnologyCard
                  name={related.name}
                  description={related.description}
                />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ProgressBar } from '@/features/deep-dive/components/ProgressBar';
import { Breadcrumb } from '@/features/deep-dive/components/Breadcrumb';
import { SectionHeading } from '@/features/deep-dive/components/SectionHeading';
import { Callout } from '@/features/deep-dive/components/Callout';
import { TradeoffComparison } from '@/features/deep-dive/components/TradeoffComparison';
import { RelatedTechnologyCard } from '@/features/deep-dive/components/RelatedTechnologyCard';
import { Tag } from '@/features/deep-dive/components/Tag';
import { CassandraIllustration } from '@/features/deep-dive/illustrations/Cassandra';
import { RedisIllustration } from '@/features/deep-dive/illustrations/Redis';
import { KafkaIllustration } from '@/features/deep-dive/illustrations/Kafka';
import { PostgresIllustration } from '@/features/deep-dive/illustrations/Postgres';
import { DynamoDBIllustration } from '@/features/deep-dive/illustrations/DynamoDB';
import { getDeepDiveBySlug, getPreviousAndNext } from '@/features/deep-dive/data';
import '@/features/deep-dive/styles/deep-dive.css';
import { MongoDBIllustration } from '@/features/deep-dive/illustrations/MongoDB';

const illustrationMap: Record<string, React.ReactNode> = {
  cassandra: <CassandraIllustration />,
  redis: <RedisIllustration />,
  kafka: <KafkaIllustration />,
  postgres: <PostgresIllustration />,
  dynamodb: <DynamoDBIllustration />,
  mongodb: <MongoDBIllustration />
};

export default async function DeepDiveArticlePage({ params }: { params: { slug: string } }) {
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
          {article.tags.map(tag => (
            <Tag key={tag}>{tag}</Tag>
          ))}
        </div>

        <p className="lede">{article.lede}</p>

        {article.sections.map(section => (
          <section key={section.number}>
            <SectionHeading number={section.number}>{section.title}</SectionHeading>
            {section.content.map((paragraph, index) => (
              <p key={index} dangerouslySetInnerHTML={{ __html: paragraph }} />
            ))}
            {section.callout && (
              <Callout label={section.callout.label}>
                {section.callout.content}
              </Callout>
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
            {article.related.map(related => (
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
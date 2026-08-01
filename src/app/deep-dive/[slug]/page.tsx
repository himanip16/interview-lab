// src/app/deep-dive/[slug]/page.tsx

import { notFound } from "next/navigation";
import Link from "next/link";
import type { ReactNode } from "react";

import { SectionHeading } from "@/features/deep-dive/components/SectionHeading";
import { Callout } from "@/features/deep-dive/components/Callout";
import { TradeoffComparison } from "@/features/deep-dive/components/TradeoffComparison";
import { RelatedTechnologyCard } from "@/features/deep-dive/components/RelatedTechnologyCard";
import { Tag } from "@/features/deep-dive/components/Tag";
import { ThemeToggle } from "@/features/deep-dive/components/ThemeToggle";
import { IllustrationBlock } from "@/features/deep-dive/components/IllustrationBlock";
import { Table } from "@/features/deep-dive/components/Table";
import { Subsection } from "@/features/deep-dive/components/Subsection";

import { getDeepDiveBySlug, getPreviousAndNext } from "@/content/deep-dive";
import { contentComponents } from "@/content/deep-dive/component-registry";

import "@/styles/tokens.css";

import { BookOpen, MessageSquare, Code2, ChevronLeft } from "lucide-react";
import styles from './page.module.css';

// renamed to avoid colliding with the `CodeBlock` content-block type
import CodeBlockRenderer from "@/shared/code/CodeBlock";

import type {
  DeepDiveArticle,
  Section,
  ContentBlock,
  InlineContent,
  RelatedResource,
} from "@/features/deep-dive/types";

type PageProps = {
  params: Promise<{ slug: string }>;
};

type IconKey = keyof typeof iconMap;

const iconMap: Record<string, ReactNode> = {
  book: <BookOpen size={18} />,
  message: <MessageSquare size={18} />,
  code: <Code2 size={18} />,
};

// --- Inline content rendering -------------------------------------------
// `lede` and paragraph blocks are now structured (InlineContent[]) rather
// than raw HTML strings, so no sanitize/dangerouslySetInnerHTML needed.

function renderInline(content: InlineContent[]) {
  return content.map((node, i) => {
    if (node.type === "link") {
      const href =
        node.ref.kind === "deep-dive"
          ? `/deep-dive/${node.ref.target}`
          : node.ref.target;
      return (
        <Link key={i} href={href}>
          {node.text}
        </Link>
      );
    }
    switch (node.type) {
      case "bold":
        return <strong key={i}>{node.text}</strong>;
      case "italic":
        return <em key={i}>{node.text}</em>;
      case "code":
        return <code key={i}>{node.text}</code>;
      default:
        return <span key={i}>{node.text}</span>;
    }
  });
}

function renderParagraphs(paragraphs: { content: InlineContent[] }[]) {
  return paragraphs.map((p, i) => <p key={i}>{renderInline(p.content)}</p>);
}

// --- Block rendering ------------------------------------------------------
// Blocks are now a single ordered, mixed-type array per section instead of
// fixed named slots (content/illustration/video/callout/resources).

function renderBlock(block: ContentBlock, key: number) {
  switch (block.type) {
    case "paragraph":
      return <p key={key}>{renderInline(block.content)}</p>;

    case "code":
      return (
        <CodeBlockRenderer
          key={key}
          code={block.code}
          language={block.language}
          // title / highlight / collapsible are new — wire these through
          // once CodeBlockRenderer supports them
        />
      );

    case "diagram": {
      // renderEngine is a discriminated union — component/image use the
      // registry or a src, excalidraw/flowchart/mermaid need their own
      // renderers (not present in the old page at all)
      const Illustration =
        block.renderEngine === "component"
          ? contentComponents[block.componentName]
          : null;
      return (
       
  <IllustrationBlock
    key={key}
    illustration={Illustration ? <Illustration /> : null}
    caption={block.caption}
    alt={block.alt}
    width={block.width}
  />
);
      
    }

    case "callout":
      return (
        <Callout
      key={key}
      variant={block.variant}
      label={block.label}
      title={block.title}
      content={block.content}
    />
      );

    case "tradeoff":
      return (
        <TradeoffComparison
          key={key}
          strengths={block.sides.flatMap((s) => s.pros)}
          weaknesses={block.sides.flatMap((s) => s.cons)}
          // this is a lossy shim — TradeoffComparison was built for a
          // flat strengths/weaknesses shape; the new TradeoffBlock has
          // named sides (title, description, verdict) worth surfacing
          // properly rather than flattening
        />
      );

    case "quote":
      return (
        <blockquote key={key}>
          <p>{block.quote}</p>
          {(block.author || block.role) && (
            <footer>
              {block.author}
              {block.role ? `, ${block.role}` : ""}
            </footer>
          )}
        </blockquote>
      );

    case "image":
      return (
        <figure key={key}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={block.src} alt={block.alt} />
          {block.caption && <figcaption>{block.caption}</figcaption>}
        </figure>
      );

    case "table":
      return (
        <Table
          key={key}
          headers={block.headers}
          rows={block.rows.map(row => ({
            cells: row.map(cell => ({ content: cell }))
          }))}
        />
      );

    case "comparison":
      // brand new block type — no existing UI for this in the old page
      return (
        <Table
          key={key}
          headers={['', ...block.columns.map(c => c.label)]}
          rows={block.rows.map(row => ({
            cells: [
              { content: row.feature, isBold: true },
              ...block.columns.map(c => ({ content: row.cells[c.id] }))
            ]
          }))}
        />
      );

    case "subsection":
      return (
        <Subsection
          key={key}
          dotColor={block.dotColor}
          title={block.title}
          content={block.content}
        />
      );

    case "concept-ref":
      // needs access to article.glossary to resolve conceptId — see
      // renderSection below where glossary is threaded in
      return null;

    default:
      return null;
  }
}

function renderSection(section: Section, glossary: DeepDiveArticle["glossary"]) {
  return (
    <section key={section.id}>
      <div className={styles.h2row}>
        <SectionHeading number={section.number}>{section.title}</SectionHeading>
      </div>

      {section.lede && renderParagraphs(section.lede)}

      {section.blocks.map((block, i) => {
        if (block.type === "concept-ref") {
          const concept = glossary?.[block.conceptId];
          if (!concept) return null;
          return (
            <div key={i} className="concept-ref">
              <strong>{concept.term}</strong>
              {renderParagraphs(block.summaryOverride ?? concept.definition)}
            </div>
          );
        }
        return renderBlock(block, i);
      })}
    </section>
  );
}

export default async function DeepDiveArticlePage({ params }: PageProps) {
  const { slug } = await params;

  const article = getDeepDiveBySlug(slug);
  if (!article) {
    notFound();
  }

  const { previous, next } = getPreviousAndNext(slug);
  const { metadata } = article;

  const relatedArticles: RelatedResource[] =
    article.resources?.filter((r) => r.type === "article") ?? [];

  // Fetch hero diagrams for linked articles
  const relatedArticlesWithHeroes = relatedArticles.map((related) => {
    if (!related.slug) return { ...related, heroIllustration: null };
    
    const linkedArticle = getDeepDiveBySlug(related.slug);
    if (!linkedArticle?.heroDiagram || linkedArticle.heroDiagram.renderEngine !== "component") {
      return { ...related, heroIllustration: null };
    }
    
    const HeroComponent = contentComponents[linkedArticle.heroDiagram.componentName];
    return {
      ...related,
      heroIllustration: HeroComponent ? <HeroComponent /> : null
    };
  });

  return (
    <div className={styles.wrap}>
          {article.heroDiagram?.renderEngine === "component" && (
            <div className={styles.markSm} style={{ width: 56, height: 56, marginBottom: 16 }}>
              {(() => {
                const Hero = contentComponents[article.heroDiagram.componentName];
                return Hero ? <Hero /> : null;
              })()}
            </div>
          )}

          {metadata.eyebrow && <div className={styles.eyebrow}>{metadata.eyebrow}</div>}
          <h1 className={styles.title}>{metadata.name}</h1>

          <div className={styles.tags}>
            {metadata.tags.map((tag) => (
              <Tag key={tag}>{tag}</Tag>
            ))}
          </div>

          <div className={styles.lede}>{renderParagraphs(article.lede)}</div>

          {article.sections.map((section) => renderSection(section, article.glossary))}

          {relatedArticlesWithHeroes.length > 0 && (
            <div className={styles.related}>
              <div className={styles.lbl}>Continue the thread</div>
              <div className={styles.relRow}>
                {relatedArticlesWithHeroes.map((related) =>
                  related.slug ? (
                    <Link key={related.slug} href={`/deep-dive/${related.slug}`}>
                      <RelatedTechnologyCard
                        name={related.title}
                        description={related.description ?? ""}
                        heroIllustration={related.heroIllustration}
                        relationship={related.relationship as any}
                      />
                    </Link>
                  ) : null
                )}
              </div>
            </div>
          )}

          {(previous || next) && (
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 64, gap: 16 }}>
              <div>{previous && <Link href={`/deep-dive/${previous.metadata.slug}`}>← {previous.metadata.name}</Link>}</div>
  <div>{next && <Link href={`/deep-dive/${next.metadata.slug}`}>{next.metadata.name} →</Link>}</div>
            </div>
          )}
        </div>
  );
}
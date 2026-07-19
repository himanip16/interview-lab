interface DeepDiveHeroProps {
  systemName: string;              // "Cassandra"
  category: string;                 // "Wide-Column NoSQL"
  eyebrow: string;                  // "WIDE-COLUMN · NoSQL"
  description: string[];            // Array of paragraphs
  tags: string[];                   // ["Distributed", "High write throughput"]
  credit: string;                   // "Maintained by"
  creditOrg: string;                // "Apache Software Foundation"
  diagramSvg: React.ReactNode;      // <CassandraDiagram />
  prevSystem?: { name: string; slug: string };
  nextSystem?: { name: string; slug: string };
  readMoreHref?: string;
  docsUrl?: string;
}

export function DeepDiveHero({
  systemName,
  category,
  eyebrow,
  description,
  tags,
  credit,
  creditOrg,
  diagramSvg,
  prevSystem,
  nextSystem,
  readMoreHref,
  docsUrl
}: DeepDiveHeroProps) {
  return (
    <div>
      <h1>{systemName}</h1>
      <p>{category}</p>
      <div>{eyebrow}</div>
      {description.map((p, i) => <p key={i}>{p}</p>)}
      {tags.map(t => <span key={t}>{t}</span>)}
      <p>{credit} {creditOrg}</p>
      {diagramSvg}
      {readMoreHref && <a href={readMoreHref}>Read More</a>}
      {docsUrl && <a href={docsUrl} target="_blank">Docs</a>}
    </div>
  );
}
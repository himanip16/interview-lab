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
  onReadMore?: () => void;
  onDocuments?: () => void;
}
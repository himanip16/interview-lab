// scripts/generate-transcripts.ts

import { readdirSync, writeFileSync, readFileSync } from "fs";
import { join } from "path";

const ROOT = join(process.cwd(), "src/content/transcripts");
const OUT = join(
  process.cwd(),
  "src/features/library/data/generated.ts"
);

function scanCategory(category: string): string[] {
  const dir = join(ROOT, category);

  return readdirSync(dir, { withFileTypes: true })
    .filter(
      (entry) =>
        entry.isFile() &&
        /\.(ts|tsx)$/.test(entry.name) &&
        entry.name !== "index.ts"
    )
    .map((entry) => entry.name.replace(/\.(ts|tsx)$/, ""))
    .sort();
}

const categories = readdirSync(ROOT, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .sort();

const entries: Array<{
  category: string;
  slug: string;
  variable: string;
}> = [];

function toIdentifier(slug: string): string {
  return slug.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
}

for (const category of categories) {
  for (const slug of scanCategory(category)) {
    entries.push({
      category,
      slug,
      variable: toIdentifier(slug),
    });
  }
}

// Add IDs to transcript files
let idCounter = 1;
for (const entry of entries) {
  const filePath = join(ROOT, entry.category, `${entry.slug}.ts`);
  const content = readFileSync(filePath, 'utf-8');
  
  // Check if id already exists in summary
  const summaryMatch = content.match(/const \w+: TranscriptEntry = \{[\s\S]*?summary: \{([\s\S]*?)\},[\s\S]*?transcript/);
  if (summaryMatch) {
    const summaryContent = summaryMatch[1];
    if (!summaryContent.includes('id:')) {
      // Add id as the first field in summary
      const newSummaryContent = `    id: ${idCounter++},
${summaryContent}`;
      const newContent = content.replace(
        /const \w+: TranscriptEntry = \{[\s\S]*?summary: \{([\s\S]*?)\},[\s\S]*?transcript/,
        (match) => match.replace(summaryContent, newSummaryContent)
      );
      writeFileSync(filePath, newContent);
      console.log(`Added id ${idCounter - 1} to ${entry.slug}`);
    }
  }
}

const imports = entries
  .map(
    ({ category, slug, variable }) =>
      `import ${variable} from "@/content/transcripts/${category}/${slug}";`
  )
  .join("\n");

const array = entries
  .map(({ variable }) => `  ${variable},`)
  .join("\n");

const output = `// AUTO-GENERATED FILE.
// DO NOT EDIT.
// Run: npm run generate-transcripts

import type { TranscriptEntry } from "@/content/transcripts/types";

${imports}

export const TRANSCRIPTS: readonly TranscriptEntry[] = [
${array}
];
`;

writeFileSync(OUT, output);

console.log(`Generated ${entries.length} transcript imports.`);
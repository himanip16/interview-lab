// scripts/generate-transcripts.ts

import { readdirSync, writeFileSync } from "fs";
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

${imports}

export const TRANSCRIPTS = [
${array}
] as const;
`;

writeFileSync(OUT, output);

console.log(`Generated ${entries.length} transcript imports.`);
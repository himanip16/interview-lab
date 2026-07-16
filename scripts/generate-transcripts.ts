import { readdirSync, writeFileSync } from "fs";
import { join } from "path";

const ROOT = join(process.cwd(), "src/content/transcripts");
const OUT = join(process.cwd(), "src/features/library/data/generated.ts");

function scanCategory(category: string): string[] {
  const dir = join(ROOT, category);
  return readdirSync(dir, { withFileTypes: true })
    .filter((d) => d.isFile() && /\.(ts|tsx)$/.test(d.name))
    .map((d) => d.name.replace(/\.(ts|tsx)$/, ""));
}

const categories = readdirSync(ROOT, { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => d.name);

const entries: { category: string; slug: string }[] = [];
for (const category of categories) {
  for (const slug of scanCategory(category)) {
    entries.push({ category, slug });
  }
}

const imports = entries
  .map((e, i) => `import transcript${i} from "@/content/transcripts/${e.category}/${e.slug}";`)
  .join("\n");

const arr = entries.map((_, i) => `  transcript${i},`).join("\n");

writeFileSync(
  OUT,
  `// AUTO-GENERATED — do not edit by hand. Run \`npm run generate:transcripts\`.
${imports}

export const TRANSCRIPTS = Object.freeze([
${arr}
]);
`
);

console.log(`Generated ${entries.length} transcript imports.`);

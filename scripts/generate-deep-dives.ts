// scripts/generate-deep-dives.ts


import fs from "node:fs";
import path from "node:path";

const articlesDir = path.join(
  process.cwd(),
  "src/content/deep-dive/articles"
);

const output = path.join(
  process.cwd(),
  "src/content/deep-dive/generated.ts"
);

const files = fs
  .readdirSync(articlesDir)
  .filter((file) => file.endsWith(".ts"))
  .sort();

const imports = files.map((file) => {
  const name = path.basename(file, ".ts");

  return `import { article as ${name} } from "./articles/${name}";`;
});

const content = `${imports.join("\n")}

export const deepDiveRegistry = [
${files
  .map((file) => `  ${path.basename(file, ".ts")},`)
  .join("\n")}
];
`;

fs.writeFileSync(output, content);

console.log(`Generated ${files.length} deep dives.`);
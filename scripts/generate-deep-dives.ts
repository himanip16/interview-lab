// scripts/generate-deep-dives.ts

import fs from "node:fs";
import path from "node:path";

const articlesDir = path.join(
  process.cwd(),
  "src/content/deep-dive/articles"
);

const output = path.join(
  process.cwd(),
  "src/features/deep-dive/data/generated.ts"
);

const files = fs
  .readdirSync(articlesDir)
  .filter((file) => file.endsWith(".ts"));


const imports = files.map((file) => {
  const name = path.basename(file, ".ts");

  const exportName =
    name
      .split("-")
      .map(
        part =>
          part[0].toUpperCase() + part.slice(1)
      )
      .join("") + "Data";

  return {
    import:
      `import { ${exportName} } from "@/content/deep-dive/articles/${name}";`,
    exportName
  };
});


const content = `
${imports.map(i => i.import).join("\n")}

export const deepDiveRegistry = [
${imports.map(i => `  ${i.exportName}`).join(",\n")}
];
`;


fs.writeFileSync(
  output,
  content.trim()
);

console.log(
  `Generated ${files.length} deep dives`
);
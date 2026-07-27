// scripts/generate-component-registry.ts

import { readdirSync, readFileSync, writeFileSync } from "fs";
import { join } from "path";

const ILLUSTRATIONS_DIR = join(process.cwd(), "src/content/deep-dive/illustrations");
const OUTPUT_FILE = join(process.cwd(), "src/content/deep-dive/component-registry.ts");

function extractExportedComponents(content: string): string[] {
  const components: string[] = [];
  
  // Match: export function ComponentName() or export const ComponentName
  const functionRegex = /export\s+function\s+(\w+)/g;
  const constRegex = /export\s+(?:const|let|var)\s+(\w+)/g;
  
  let match;
  while ((match = functionRegex.exec(content)) !== null) {
    components.push(match[1]);
  }
  
  // Reset lastIndex for the second regex
  constRegex.lastIndex = 0;
  while ((match = constRegex.exec(content)) !== null) {
    // Filter out non-component exports (like types, interfaces)
    if (!match[1].startsWith('type') && !match[1].startsWith('interface')) {
      components.push(match[1]);
    }
  }
  
  return [...new Set(components)]; // Remove duplicates
}

function toPascalCase(filename: string): string {
  return filename
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .replace(/\s+/g, '');
}

const files = readdirSync(ILLUSTRATIONS_DIR, { withFileTypes: true })
  .filter((entry) => entry.isFile() && /\.(ts|tsx)$/.test(entry.name))
  .map((entry) => entry.name)
  .sort();

const imports: string[] = [];
const exports: string[] = [];

for (const file of files) {
  const filePath = join(ILLUSTRATIONS_DIR, file);
  const content = readFileSync(filePath, "utf-8");
  const components = extractExportedComponents(content);
  
  if (components.length > 0) {
    const baseName = file.replace(/\.(ts|tsx)$/, "");
    const importPath = `./illustrations/${baseName}`;
    
    for (const component of components) {
      imports.push(`import { ${component} } from "${importPath}";`);
      exports.push(`  ${component},`);
    }
  }
}

const output = `// AUTO-GENERATED FILE.
// DO NOT EDIT.
// Run: npm run generate:component-registry

import type { ComponentType } from "react";

${imports.join("\n")}

export const contentComponents: Record<string, ComponentType> = {
${exports.join("\n")}
};
`;

writeFileSync(OUTPUT_FILE, output);

console.log(`Generated component registry with ${exports.length} components from ${files.length} files.`);

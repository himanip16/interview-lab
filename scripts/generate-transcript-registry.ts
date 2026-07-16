import fs from "fs";
import path from "path";

const BASE_PATH = path.join(process.cwd(), "src/content/transcripts");

const categories = fs
  .readdirSync(BASE_PATH)
  .filter((file) =>
    fs.statSync(path.join(BASE_PATH, file)).isDirectory()
  );

const imports: string[] = [];
const entries: string[] = [];

let counter = 0;

for (const category of categories) {
  const categoryPath = path.join(BASE_PATH, category);
  const files = fs
    .readdirSync(categoryPath)
    .filter(file => file.endsWith(".ts") && file !== "index.ts");

  for (const file of files) {
    const name = `transcript${counter++}`;

    imports.push(
      `import ${name} from "./${category}/${file.replace(".ts", "")}";`
    );

    entries.push(name);
  }
}

const output = `${imports.join("\n")}

export const TRANSCRIPTS = [
${entries.join(",\n")}
];
`;

fs.writeFileSync(
  path.join(BASE_PATH, "registry.ts"),
  output
);

console.log(`Generated registry with ${entries.length} transcripts`);

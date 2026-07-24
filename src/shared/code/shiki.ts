import { createHighlighter, type Highlighter } from "shiki";
import {
  transformerNotationDiff,
  transformerNotationFocus,
  transformerNotationHighlight,
} from "@shikijs/transformers";

let highlighter: Highlighter | null = null;

export async function getHighlighter() {
  if (!highlighter) {
    highlighter = await createHighlighter({
      themes: ["github-dark"],
      langs: [
        "typescript",
        "javascript",
        "tsx",
        "jsx",
        "java",
        "kotlin",
        "python",
        "go",
        "rust",
        "c",
        "cpp",
        "csharp",
        "sql",
        "bash",
        "json",
        "yaml",
        "xml",
        "html",
        "css",
        "scss",
        "cql",
        "dockerfile",
      ],
    });
  }

  return highlighter;
}

export async function highlightSnippet(
  code: string,
  language = "text"
) {
  const highlighter = await getHighlighter();

  return highlighter.codeToHtml(code, {
    lang: language,
    theme: "github-dark",
    transformers: [
      transformerNotationHighlight(),
      transformerNotationDiff(),
      transformerNotationFocus(),
    ],
  });
}
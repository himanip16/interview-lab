import { createHighlighter, type Highlighter } from 'shiki';
import { 
  transformerNotationHighlight, 
  transformerNotationDiff, 
  transformerNotationFocus 
} from '@shikijs/transformers';

let highlighter: Highlighter | null = null;

export async function getHighlighter() {
  if (!highlighter) {
    highlighter = await createHighlighter({
      themes: ['github-dark'],
      langs: ['typescript', 'sql', 'bash', 'json', 'cql'],
    });
  }
  return highlighter;
}

export async function highlightSnippet(code: string, lang: string) {
  const hl = await getHighlighter();
  return hl.codeToHtml(code, {
    lang,
    theme: 'github-dark',
    transformers: [
      transformerNotationHighlight(),
      transformerNotationDiff(),
      transformerNotationFocus(),
    ],
  });
}
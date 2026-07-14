// src/features/library/utils/textCleaner.ts

/**
 * Cleans common unicode escape sequences and formatting issues from transcript text
 * Converts raw unicode sequences to their actual characters
 */
export function cleanTranscriptText(text: string): string {
  return text
    // Common unicode escape sequences
    .replace(/\\u2014/g, "—") // em dash
    .replace(/\\u2013/g, "–") // en dash
    .replace(/\\u2018/g, "‘") // left single quote
    .replace(/\\u2019/g, "’") // right single quote
    .replace(/\\u201C/g, "“") // left double quote
    .replace(/\\u201D/g, "”") // right double quote
    .replace(/\\u2026/g, "…") // ellipsis
    .replace(/\\u00A0/g, " ") // non-breaking space
    // Common formatting issues
    .replace(/\\n/g, "\n") // escaped newlines
    .replace(/\\t/g, "  ") // escaped tabs to double space
    .trim();
}

/**
 * Cleans content blocks in a transcript message
 */
export function cleanContentBlocks(content: any): any {
  if (typeof content === "string") {
    return cleanTranscriptText(content);
  }
  
  if (Array.isArray(content)) {
    return content.map(block => {
      if (typeof block === "string") {
        return cleanTranscriptText(block);
      }
      if (block && typeof block === "object" && block.value) {
        return {
          ...block,
          value: cleanTranscriptText(block.value)
        };
      }
      return block;
    });
  }
  
  return content;
}

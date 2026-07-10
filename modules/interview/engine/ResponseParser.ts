// modules/interview/engine/ResponseParser.ts
export interface ParsedResponse {
  content: string;
  shouldTransition: boolean;
  feedbackSignals: string[];
}

export class ResponseParser {
  parse(rawText: string): ParsedResponse {
    const transitionSignal = "[[TRANSITION]]";
    const shouldTransition = rawText.includes(transitionSignal);
    
    // Clean the text by removing the internal signals
    const cleanContent = rawText.replace(transitionSignal, "").trim();

    return {
      content: cleanContent,
      shouldTransition,
      feedbackSignals: [] // You can expand this to extract JSON scores etc.
    };
  }
}
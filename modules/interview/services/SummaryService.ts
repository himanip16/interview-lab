// modules/interview/services/SummaryService.ts
import { AIService } from "../../ai/AIService";

export async function generateSummary(messages: any[]) {
  const ai = new AIService();
  // Only take the last 10 messages for context to save tokens/time
  const transcript = messages.slice(-10).map(m => `${m.role}: ${m.content}`).join("\n");
  
  const prompt = `
    Summarize the current progress of this System Design Interview.
    Format: 3-5 bullet points.
    Focus on: What has been decided regarding Requirements, Scale, and Core Components.
    
    Transcript:
    ${transcript}
  `;

  return await ai.chat([{ role: 'user', content: prompt }]); 
}
"use strict";

import { PhaseManager, InterviewPhase } from './PhaseManager';
import { PromptBuilder } from './PromptBuilder';
import { ResponseParser } from './ResponseParser';
// This @ refers to your root directory defined in tsconfig.json
import { AIService } from '@/modules/ai/AIService'; 

export class InterviewEngine {
  private phaseManager = new PhaseManager();
  private promptBuilder = new PromptBuilder();
  private responseParser = new ResponseParser();
  private aiService = new AIService();

  async processUserMessage(
    currentPhase: InterviewPhase,
    history: { role: string, content: string }[],
    problem: string,
    candidateName: string
  ) {
    // 1. Build the prompt
    const systemPrompt = this.promptBuilder.buildSystemPrompt(currentPhase, candidateName, problem);
    
    // 2. Call AI
    const aiResponse = await this.aiService.chat([
      { role: 'system', content: systemPrompt },
      ...history
    ]);

    // 3. Parse the response
    const parsed = this.responseParser.parse(aiResponse);

    // 4. Determine next state
    let nextPhase = currentPhase;
    if (parsed.shouldTransition) {
      nextPhase = this.phaseManager.getNextPhase(currentPhase);
    }

    return {
      answer: parsed.content,
      nextPhase: nextPhase,
    };
  }
}
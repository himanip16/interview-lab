"use strict";

import { InterviewPhase } from "./InterviewStateMachine";
import { PromptBuilder } from "./PromptBuilder";
import { ResponseParser } from "./ResponseParser";
import { AIService, ChatMessage } from "@/src/modules/ai/services/AIService";
import { PromptGuard } from "../guardrails/PromptGuard";
export class InterviewEngine {
  constructor(
    private readonly aiService = new AIService(),
    private readonly promptBuilder = new PromptBuilder(),
    private readonly responseParser = new ResponseParser(),
    private readonly promptGuard = new PromptGuard()
  ) {}

  private static readonly HISTORY_WINDOW = 20;

  async processUserMessage(
    currentPhase: InterviewPhase,
    history: ChatMessage[],
    runningSummary: string,
    problem: string,
    candidateName: string
  ) {
    const systemPrompt =
      await this.promptBuilder.buildSystemPrompt(
        currentPhase,
        candidateName,
        problem,
        runningSummary
      );

    // Only send the most recent conversation window
    const recentHistory = history.slice(
      -InterviewEngine.HISTORY_WINDOW
    );
    const guardedInput = this.promptGuard.guard(
    history.at(-1)?.content ?? ""
);


    const messages = [
    {
        role: "system",
        content: systemPrompt,
    },
    ...recentHistory.slice(0, -1),
    {
        role: "user",
        content: guardedInput,
    },
];

    const aiResponse = await this.aiService.chat(messages);

    return this.responseParser.parse(
      aiResponse,
      () => this.aiService.chat(messages)
    );
  }
}
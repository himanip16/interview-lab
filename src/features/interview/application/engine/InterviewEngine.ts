"use strict";

import {
  AIService,
  ChatMessage,
} from "@/modules/ai/services/AIService";

import { PromptGuard } from "../guardrails/PromptGuard";
import { InterviewProfile } from "../profiles/InterviewProfile";
import { CandidatePersona } from "../reverse/CandidatePersonas";

import { InterviewStateMachine } from "./InterviewStateMachine";
import { PromptBuilder } from "./PromptBuilder";
import { ResponseParser } from "./ResponseParser";
import { INTERVIEWER_JSON_SCHEMA } from "./ResponseParser";

export interface InterviewEngineInput {
  profile: InterviewProfile;

  currentPhase: string;

  history: ChatMessage[];

  runningSummary: string;

  problem: string;

  candidateName: string;

  interviewDurationMinutes: number;

  interviewStartedAt: Date;

  phaseStartedAt: Date;

  whiteboardDescription?: string;

  mode: "CANDIDATE" | "REVERSE";

  persona?: CandidatePersona;
}

export class InterviewEngine {
  constructor(
    private readonly aiService =
      new AIService(),

    private readonly promptBuilder =
      new PromptBuilder(),

    private readonly responseParser =
      new ResponseParser(),

    private readonly promptGuard =
      new PromptGuard()
  ) {}

  private static readonly HISTORY_WINDOW = 20;

  async processUserMessage(
    input: InterviewEngineInput
  ) {
    const stateMachine =
      new InterviewStateMachine(
        input.profile
      );

    const phase = stateMachine.getPhase(
      input.currentPhase as any
    );

    const recentHistory =
      input.history.slice(
        -InterviewEngine.HISTORY_WINDOW
      );

    const latestMessage =
      recentHistory.at(-1);

    // In Reverse Mode, the latest message is the user's current question
    // In Candidate Mode, we need the previous question for context
    const latestQuestion = input.mode === "REVERSE"
      ? latestMessage?.content
      : recentHistory.length >= 2
        ? recentHistory[recentHistory.length - 2]?.content
        : undefined;

    // Check for prompt injection and get silent steering instruction
    const userMessage = latestMessage?.content || "";
    const steeringInstruction = this.promptGuard.getSteeringInstruction(
      userMessage,
      input.currentPhase
    );

    const systemPrompt = input.mode === "REVERSE"
      ? await this.promptBuilder.buildReverseSystemPrompt(
          phase,
          input.persona!,
          input.problem,
          input.runningSummary,
          latestQuestion
        )
      : await this.promptBuilder.buildSystemPrompt(
          phase,
          input.candidateName,
          input.problem,
          input.runningSummary,
          latestQuestion,
          input.whiteboardDescription
        );

    // Prepend silent steering instruction if risk detected
    const finalSystemPrompt = steeringInstruction
      ? steeringInstruction + "\n\n" + systemPrompt
      : systemPrompt;

    const messages: ChatMessage[] = [
      {
        role: "system",
        content: finalSystemPrompt,
      },

      ...recentHistory.slice(0, -1),

      {
        role: "user",
        content: latestMessage?.content ?? "",
      },
    ];

    

const aiResponse =
  await this.aiService.chat(messages, {
    task: "interviewer",
    format: INTERVIEWER_JSON_SCHEMA,
  });

const parsed =
  await this.responseParser.parse(
    aiResponse,
    () =>
      this.aiService.chat(
        [
          {
            role: "system",
            content: `
Repair the response into valid JSON.

Return ONLY JSON.

Required shape:

{
  "reply": "string",
  "phaseAssessment": {
    "goalCoverage": {
      "goal_name": 0.0
    },
    "confidence": 0.0,
    "unresolvedTopics": []
  }
}

Do not return transition.

Do not return nextPhase.

All goal coverage values and confidence must be between 0 and 1.
`.trim(),
          },
          {
            role: "user",
            content: aiResponse,
          },
        ],
        {
          task: "repair",
          format: INTERVIEWER_JSON_SCHEMA,
        }
      )
  );

    const now = Date.now();

    const elapsedInterviewSeconds =
      Math.max(
        Math.floor(
          (
            now -
            input.interviewStartedAt.getTime()
          ) / 1000
        ),
        0
      );

    const elapsedPhaseSeconds =
      Math.max(
        Math.floor(
          (
            now -
            input.phaseStartedAt.getTime()
          ) / 1000
        ),
        0
      );

    const transition =
      stateMachine.evaluateTransition({
        currentPhase: input.currentPhase as any,

        interviewDurationMinutes:
          input.interviewDurationMinutes,

        elapsedInterviewSeconds,

        elapsedPhaseSeconds,

        assessment:
          parsed.phaseAssessment ?? {
            goalCoverage: {},
            confidence: 0.5,
            unresolvedTopics: [],
          },
      });

    return {
      reply: parsed.reply,

      phaseAssessment:
        parsed.phaseAssessment,

      transition,
    };
  }
}
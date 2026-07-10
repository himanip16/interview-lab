// modules/interview/engine/PromptBuilder.ts
import { InterviewPhase } from './PhaseManager';

export class PromptBuilder {
  buildSystemPrompt(phase: InterviewPhase, candidateName: string, problem: string): string {
    const phaseInstructions = {
      [InterviewPhase.INTRODUCTION]: "Briefly introduce yourself as a senior architect and present the problem statement.",
      [InterviewPhase.REQUIREMENTS]: "Guide the candidate to define functional and non-functional requirements. Don't give answers.",
      [InterviewPhase.HIGH_LEVEL_DESIGN]: "Ask for a high-level architecture: APIs, Database schema, and core components.",
      [InterviewPhase.DEEP_DIVE]: "Pick one component (e.g., scaling the DB or Load Balancing) and go deep.",
      [InterviewPhase.BOTTLE_NECKS]: "Ask about single points of failure and trade-offs made.",
      [InterviewPhase.CLOSING]: "Wrap up the interview and thank the candidate."
    };

    return `
      You are an expert System Design Interviewer. 
      Candidate: ${candidateName}
      Problem: ${problem}
      Current Phase: ${phase}

      INSTRUCTIONS:
      - Stay in character. 
      - Be helpful but rigorous.
      - ${phaseInstructions[phase]}
      
      CRITICAL: If you feel the current phase is complete, end your response with the token [[TRANSITION]].
    `;
  }
}
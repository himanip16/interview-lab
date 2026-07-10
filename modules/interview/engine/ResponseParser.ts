import { InterviewPhase } from "./PhaseManager";

export class ResponseParser {
  parse(aiResponse: string) {
    const hasTransition = aiResponse.includes("[[TRANSITION]]");

    const cleanMessage = aiResponse
      .replace("[[TRANSITION]]", "")
      .trim();

    return {
      cleanMessage,
      shouldTransition: hasTransition,
    };
  }

  getNextPhase(currentPhase: InterviewPhase): InterviewPhase {
    const phases = Object.values(InterviewPhase);
    const currentIndex = phases.indexOf(currentPhase);

    return phases[currentIndex + 1] ?? currentPhase;
  }
}
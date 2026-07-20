import { AIService } from "./ai/services/AIService";
import { PromptLoader } from "@/features/interview/prompts/prompt/PromptLoader";
import logger  from "@/shared/logger/logger";
import { EvaluationService } from "./interview/services/evaluation/EvaluationService";

export function createEvaluationService() {
  return new EvaluationService(
    new AIService(),
    new PromptLoader(),
    logger
  );
}


import { AIService } from "./ai/AIService";
import { PromptLoader } from "@/src/modules/interview/prompt/PromptLoader";
import logger  from "@/src/shared/logger/logger";
import { EvaluationService } from "./interview/services/EvaluationService";

export function createEvaluationService() {
  return new EvaluationService(
    new AIService(),
    new PromptLoader(),
    logger
  );
}


import { AIService } from "./ai/AIService";
import { PromptLoader } from "./prompt/PromptLoader";
import { Logger } from "./logging/Logger";
import { EvaluationService } from "./interview/services/EvaluationService";

const ai = new AIService();
const promptLoader = new PromptLoader();
const logger = new Logger();

export const evaluationService =
  new EvaluationService(
    ai,
    promptLoader,
    logger
  );
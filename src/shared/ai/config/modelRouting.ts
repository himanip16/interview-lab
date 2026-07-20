import { env } from "@/shared/config/env";

export type AITask = "interviewer" | "summary" | "evaluation" | "repair";

export interface TaskConfig {
  model: string;
  fallbackModel: string;
  temperature: number;
}

// Model + temperature routing per workload. This is the ONLY place task
// names map to specific models — providers below know nothing about tasks.
export const getTaskConfig = (): Record<AITask, TaskConfig> => {
  const isOpenAI = env.AI_PROVIDER === "openai";

  const getModel = (openaiKey: string | undefined, ollamaKey: string | undefined) => {
    const model = isOpenAI ? openaiKey : ollamaKey;
    if (!model) {
      throw new Error(`Missing AI model configuration for provider ${env.AI_PROVIDER}`);
    }
    return model;
  };

  return {
    interviewer: {
      model: getModel(env.OPENAI_MODEL_INTERVIEWER, env.OLLAMA_MODEL_INTERVIEWER),
      fallbackModel: getModel(env.OPENAI_FALLBACK_MODEL, env.OLLAMA_FALLBACK_MODEL),
      temperature: 0.3,
    },
    summary: {
      model: getModel(env.OPENAI_MODEL_SUMMARY, env.OLLAMA_MODEL_SUMMARY),
      fallbackModel: getModel(env.OPENAI_FALLBACK_MODEL, env.OLLAMA_FALLBACK_MODEL),
      temperature: 0.2,
    },
    evaluation: {
      model: getModel(env.OPENAI_MODEL_EVALUATION, env.OLLAMA_MODEL_EVALUATION),
      fallbackModel: getModel(env.OPENAI_FALLBACK_MODEL, env.OLLAMA_FALLBACK_MODEL),
      temperature: 0,
    },
    repair: {
      model: getModel(env.OPENAI_MODEL_REPAIR, env.OLLAMA_MODEL_REPAIR),
      fallbackModel: getModel(env.OPENAI_FALLBACK_MODEL, env.OLLAMA_FALLBACK_MODEL),
      temperature: 0,
    },
  };
};

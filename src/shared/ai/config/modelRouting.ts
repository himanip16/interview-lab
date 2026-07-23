// src/shared/ai/config/modelRouting.ts

import { env } from "@/shared/config/env";

export type AITask = "interviewer" | "summary" | "evaluation" | "repair";

export interface TaskConfig {
  model: string;
  fallbackModel: string;
  temperature: number;
}

export interface UserAIConfig {
  provider?: string;
  apiKey?: string;
  model?: string;
  baseUrl?: string;
}

// Model + temperature routing per workload. This is the ONLY place task
// names map to specific models — providers below know nothing about tasks.
export const getTaskConfig = (userConfig?: UserAIConfig): Record<AITask, TaskConfig> => {
  // Use user's provider if configured, otherwise fall back to env
  const provider = userConfig?.provider || env.AI_PROVIDER;
  const isOpenAI = provider === "openai";

  // Use user's model if configured, otherwise fall back to env defaults
  const userModel = userConfig?.model;
  const userBaseUrl = userConfig?.baseUrl;

  const getModel = (openaiKey: string | undefined, ollamaKey: string | undefined) => {
    // If user has configured a specific model, use it for all tasks
    if (userModel) {
      return userModel;
    }
    
    const model = isOpenAI ? openaiKey : ollamaKey;
    if (!model) {
      throw new Error(`Missing AI model configuration for provider ${provider}`);
    }
    return model;
  };

  const getBaseUrl = () => {
    // If user has configured a custom base URL, use it
    if (userBaseUrl) {
      return userBaseUrl;
    }
    // Otherwise use env default for Ollama
    return env.OLLAMA_BASE_URL;
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

export const getProviderConfig = (userConfig?: UserAIConfig) => {
  const provider = userConfig?.provider || env.AI_PROVIDER;
  const apiKey = userConfig?.apiKey || env.OPENAI_API_KEY;
  const baseUrl = userConfig?.baseUrl || env.OLLAMA_BASE_URL;

  return {
    provider,
    apiKey,
    baseUrl,
  };
};

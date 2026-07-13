"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/src/components/ui/Toast";
import { logger } from "@/src/lib/logger";
import { startInterview } from "@/src/features/interview/services/interviewApi";
import {
  interviewSetupSchema,
  type InterviewSetupForm,
  type InterviewType,
  type SetupDifficulty,
  DIFFICULTY_MAP,
  DEFAULT_COMPANY,
  parseInterviewType,
} from "../types/setup";

interface UseInterviewSetupOptions {
  initialInterviewType?: InterviewType;
  initialDifficulty?: SetupDifficulty;
  initialDuration?: number;
  initialCompany?: string;
  initialProblemId?: string | null;
}

interface UseInterviewSetupReturn {
  form: InterviewSetupForm;
  loading: boolean;
  validationError: string | null;
  updateField: <K extends keyof InterviewSetupForm>(
    field: K,
    value: InterviewSetupForm[K],
    clearProblemId?: boolean
  ) => void;
  startInterview: () => Promise<void>;
}

/**
 * State synchronization rules:
 * - Changing interviewType clears problemId (affects problem filtering)
 * - Changing difficulty clears problemId (affects problem filtering)
 * - Changing company clears problemId (affects problem filtering)
 * - Changing duration does NOT clear problemId (doesn't affect filtering)
 * - Changing problemId directly does NOT clear itself
 */
const FILTER_FIELDS: (keyof InterviewSetupForm)[] = [
  "interviewType",
  "difficulty",
  "company",
];

export function useInterviewSetup({
  initialInterviewType = "hld",
  initialDifficulty = "Medium",
  initialDuration = 45,
  initialCompany = "",
  initialProblemId = null,
}: UseInterviewSetupOptions = {}): UseInterviewSetupReturn {
  const router = useRouter();
  const { showToast } = useToast();

  const [form, setForm] = useState<InterviewSetupForm>({
    interviewType: initialInterviewType,
    difficulty: initialDifficulty,
    duration: initialDuration,
    company: initialCompany || DEFAULT_COMPANY,
    problemId: initialProblemId || "",
  });
  const [loading, setLoading] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const updateField = useCallback(
    <K extends keyof InterviewSetupForm>(
      field: K,
      value: InterviewSetupForm[K],
      clearProblemId = true
    ) => {
      setValidationError(null);
      setForm((prev) => ({
        ...prev,
        [field]: value,
        // Clear problemId if this is a filter field and clearProblemId is true
        ...(clearProblemId && FILTER_FIELDS.includes(field) && field !== "problemId"
          ? { problemId: "" }
          : {}),
      }));
    },
    []
  );

  const buildPayload = useCallback(() => {
    return {
      type: form.interviewType,
      difficulty: DIFFICULTY_MAP[form.difficulty],
      duration: form.duration,
      company: form.company,
      problemId: form.problemId,
    };
  }, [form]);

  const startInterviewHandler = useCallback(async () => {
    // Validate form
    const validationResult = interviewSetupSchema.safeParse(form);
    if (!validationResult.success) {
      const firstError = validationResult.error.issues[0];
      setValidationError(firstError.message);
      showToast(firstError.message, "error");
      return;
    }

    // Cancel any existing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();

    try {
      setLoading(true);
      setValidationError(null);

      const payload = buildPayload();
      logger.debug("Request payload", { payload });

      const { id } = await startInterview(payload, {
        signal: abortControllerRef.current.signal,
      });
      logger.debug("Interview started with ID", { interviewId: id });

      try {
        router.push(`/interview/live/${id}`);
      } catch (navError) {
        logger.error("Navigation failed", navError);
        showToast("Failed to navigate to interview page", "error");
      }
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        logger.debug("Interview start request was aborted");
        return;
      }
      logger.error("Failed to start interview", error);

      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      setValidationError(errorMessage);
      showToast(errorMessage, "error");
    } finally {
      setLoading(false);
      abortControllerRef.current = null;
    }
  }, [form, buildPayload, router, showToast]);

  return {
    form,
    loading,
    validationError,
    updateField,
    startInterview: startInterviewHandler,
  };
}

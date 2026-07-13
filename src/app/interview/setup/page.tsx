"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useCallback, useMemo } from "react";

import CompanySelector from "@/src/features/interview/setup/components/CompanySelector";
import DifficultySelector from "@/src/features/interview/setup/components/DifficultySelector";
import DurationSelector from "@/src/features/interview/setup/components/DurationSelector";
import InterviewTypeSelector from "@/src/features/interview/setup/components/InterviewTypeSelector";
import ProblemSelector from "@/src/features/interview/setup/components/ProblemSelector";
import SetupCard from "@/src/features/interview/setup/components/SetupCard";
import { Button } from "@/src/components/ui/Button";
import { useInterviewSetup } from "@/src/features/interview/setup/hooks/useInterviewSetup";
import { parseInterviewType } from "@/src/features/interview/setup/types/setup";

export default function InterviewSetupPage() {
  const searchParams = useSearchParams();

  const problemIdParam = searchParams.get("problemId");
  const typeParam = searchParams.get("type");

  const {
    form,
    loading,
    validationError,
    updateField,
    startInterview,
  } = useInterviewSetup({
    initialInterviewType: parseInterviewType(typeParam),
    initialProblemId: problemIdParam,
  });

  // Sync form with search params when URL changes
  useEffect(() => {
    const newInterviewType = parseInterviewType(typeParam);
    if (newInterviewType !== form.interviewType) {
      updateField("interviewType", newInterviewType);
    }
    if (problemIdParam !== form.problemId) {
      updateField("problemId", problemIdParam || "", false);
    }
  }, [typeParam, problemIdParam, form.interviewType, form.problemId, updateField]);

  // Memoize onChange handlers to prevent unnecessary rerenders
  const handleInterviewTypeChange = useCallback(
    (value: string) => updateField("interviewType", value as any),
    [updateField]
  );

  const handleDifficultyChange = useCallback(
    (value: string) => updateField("difficulty", value as any),
    [updateField]
  );

  const handleDurationChange = useCallback(
    (value: number) => updateField("duration", value, false),
    [updateField]
  );

  const handleCompanyChange = useCallback(
    (value: string) => updateField("company", value),
    [updateField]
  );

  const handleProblemIdChange = useCallback(
    (value: string | null) => updateField("problemId", value || "", false),
    [updateField]
  );

  // Memoize ProblemSelector props to prevent unnecessary rerenders
  const problemSelectorProps = useMemo(
    () => ({
      value: form.problemId || null,
      onChange: handleProblemIdChange,
      interviewType: form.interviewType,
      difficulty: form.difficulty,
      company: form.company,
    }),
    [form.problemId, form.interviewType, form.difficulty, form.company, handleProblemIdChange]
  );

  return (
    <main className="min-h-screen bg-background px-6 py-12">
      <SetupCard>
        <h1 className="text-4xl font-bold text-foreground">
          Interview Setup
        </h1>

        <p className="mt-3 text-muted-foreground">
          Configure your interview before starting.
        </p>

        {validationError && (
          <div className="mb-4 rounded-lg border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
            {validationError}
          </div>
        )}

        <InterviewTypeSelector
          value={form.interviewType}
          onChange={handleInterviewTypeChange}
        />

        <DifficultySelector
          value={form.difficulty}
          onChange={handleDifficultyChange}
        />

        <DurationSelector
          value={form.duration}
          onChange={handleDurationChange}
        />

        <CompanySelector
          value={form.company}
          onChange={handleCompanyChange}
        />

        <ProblemSelector {...problemSelectorProps} />

        <Button
          type="button"
          variant="primary"
          disabled={loading || !form.problemId}
          onClick={startInterview}
          aria-busy={loading}
          className="mt-10 w-full py-4 text-lg"
        >
          {loading
            ? "Starting..."
            : "Start Interview"}
        </Button>
      </SetupCard>
    </main>
  );
}
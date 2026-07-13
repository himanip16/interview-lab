"use client";

import { useState, useEffect } from "react";
import {
  useRouter,
  useSearchParams,
} from "next/navigation";

import CompanySelector from "@/src/features/interview/setup/components/CompanySelector";
import DifficultySelector from "@/src/features/interview/setup/components/DifficultySelector";
import DurationSelector from "@/src/features/interview/setup/components/DurationSelector";
import InterviewTypeSelector from "@/src/features/interview/setup/components/InterviewTypeSelector";
import ProblemSelector from "@/src/features/interview/setup/components/ProblemSelector";
import SetupCard from "@/src/features/interview/setup/components/SetupCard";
import { useToast } from "@/src/components/ui/Toast";
import { Button } from "@/src/components/ui/Button";
import { INTERVIEW_TYPES, SETUP_DIFFICULTIES, type InterviewType, type SetupDifficulty, DIFFICULTY_MAP, DEFAULT_COMPANY, parseInterviewType } from "@/src/features/interview/setup/types/setup";
import { startInterview } from "@/src/features/interview/services/interviewApi";
import { logger } from "@/src/lib/logger";

export default function InterviewSetupPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const problemIdParam = searchParams.get("problemId");
  const typeParam = searchParams.get("type");

  const [interviewType, setInterviewType] = useState<InterviewType>(
    parseInterviewType(typeParam)
  );
  const [difficulty, setDifficulty] = useState<SetupDifficulty>("Medium");
  const [duration, setDuration] = useState(45);
  const [company, setCompany] = useState("");
  const [problemId, setProblemId] = useState<string | null>(problemIdParam);
  const [loading, setLoading] = useState(false);

  // Clear problemId when filters change to prevent stale selection
  function handleFilterChange() {
    setProblemId(null);
  }

  const { showToast } = useToast();

  async function handleStartInterview() {
    if (loading) return;
    if (!problemId) {
      showToast("Please select a problem to start the interview.", "error");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        type: interviewType,
        difficulty: DIFFICULTY_MAP[difficulty],
        duration,
        company: company || DEFAULT_COMPANY,
        problemId,
      };

      if (process.env.NODE_ENV === "development") {
        console.log("Request payload:", payload);
      }

      const { id } = await startInterview(payload);

      if (process.env.NODE_ENV === "development") {
        console.log("Interview started with ID:", id);
      }

      router.push(`/interview/live/${id}`);
    } catch (error) {
      logger.error("Failed to start interview", error);

      showToast(
        error instanceof Error
          ? error.message
          : "Unknown error",
        "error"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-background px-6 py-12">
      <SetupCard>
        <h1 className="text-4xl font-bold text-foreground">
          Interview Setup
        </h1>

        <p className="mt-3 text-muted-foreground">
          Configure your interview before starting.
        </p>

        <InterviewTypeSelector
          value={interviewType}
          onChange={(value) => {
            setInterviewType(value);
            handleFilterChange();
          }}
        />

        <DifficultySelector
          value={difficulty}
          onChange={(value) => {
            setDifficulty(value);
            handleFilterChange();
          }}
        />

        <DurationSelector
          value={duration}
          onChange={setDuration}
        />

        <CompanySelector
          value={company}
          onChange={(value) => {
            setCompany(value);
            handleFilterChange();
          }}
        />

        <ProblemSelector
          value={problemId}
          onChange={setProblemId}
          interviewType={interviewType}
          difficulty={difficulty}
          company={company}
        />

        <Button
          type="button"
          variant="primary"
          disabled={loading || !problemId}
          onClick={handleStartInterview}
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
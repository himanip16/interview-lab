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
import { INTERVIEW_TYPES, SETUP_DIFFICULTIES, type InterviewType, type SetupDifficulty, DIFFICULTY_MAP } from "@/src/features/interview/setup/types/setup";
import { StartInterviewResponseSchema } from "@/src/features/interview/setup/types/interview";

export default function InterviewSetupPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const problemIdParam = searchParams.get("problemId");
  const typeParam = searchParams.get("type");

  const [interviewType, setInterviewType] = useState<InterviewType>(
    (typeParam && INTERVIEW_TYPES.includes(typeParam as InterviewType)) ? typeParam as InterviewType : "hld"
  );
  const [difficulty, setDifficulty] = useState<SetupDifficulty>("Medium");
  const [duration, setDuration] = useState(45);
  const [company, setCompany] = useState("");
  const [problemId, setProblemId] = useState<string | null>(problemIdParam);
  const [loading, setLoading] = useState(false);

  // Sync interviewType with URL param when it changes
  useEffect(() => {
    if (typeParam && INTERVIEW_TYPES.includes(typeParam as InterviewType)) {
      setInterviewType(typeParam as InterviewType);
    }
  }, [typeParam]);

  // Sync problemId with URL param when it changes
  useEffect(() => {
    setProblemId(problemIdParam);
  }, [problemIdParam]);

  const { showToast } = useToast();

  async function handleStartInterview() {
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
        company: company || "General",
        problemId,
      };

      if (process.env.NODE_ENV === "development") {
        console.log("Request payload:", payload);
      }

      const response = await fetch(
        "/api/interviews/start",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      // Validate response with Zod
      const validatedData = StartInterviewResponseSchema.parse(data);

      if (process.env.NODE_ENV === "development") {
        console.log("Status:", response.status);
        console.log("Response:", data);
      }

      if (!response.ok) {
        throw new Error(
          data.error ?? "Failed to start interview"
        );
      }

      router.push(`/interview/live/${validatedData.id}`);
    } catch (error) {
      console.error(error);

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
          onChange={setInterviewType}
        />

        <DifficultySelector
          value={difficulty}
          onChange={setDifficulty}
        />

        <DurationSelector
          value={duration}
          onChange={setDuration}
        />

        <CompanySelector
          value={company}
          onChange={setCompany}
        />

        <ProblemSelector
          value={problemId}
          onChange={setProblemId}
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
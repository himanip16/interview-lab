"use client";

import { useState } from "react";
import {
  useRouter,
  useSearchParams,
} from "next/navigation";

import CompanySelector from "@/src/features/interview/setup/components/CompanySelector";
import DifficultySelector from "@/src/features/interview/setup/components/DifficultySelector";
import DurationSelector from "@/src/features/interview/setup/components/DurationSelector";
import InterviewTypeSelector from "@/src/features/interview/setup/components/InterviewTypeSelector";
import TopicSelector from "@/src/features/interview/setup/components/TopicSelector";
import SetupCard from "@/src/features/interview/setup/components/SetupCard";
import { useToast } from "@/src/components/ui/Toast";
import { Button } from "@/src/components/ui/Button";

export default function InterviewSetupPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const problemIdParam = searchParams.get("problemId");
  const typeParam = searchParams.get("type");

  const [interviewType, setInterviewType] = useState(typeParam ?? "hld");
  const [difficulty, setDifficulty] = useState("Medium");
  const [duration, setDuration] = useState(45);
  const [company, setCompany] = useState("");
  const [problemId, setProblemId] = useState<string | null>(problemIdParam);
  const [loading, setLoading] = useState(false);

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
        difficulty,
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

      if (process.env.NODE_ENV === "development") {
        console.log("Status:", response.status);
        console.log("Response:", data);
      }

      if (!response.ok) {
        throw new Error(
          data.error ?? "Failed to start interview"
        );
      }

      router.push(`/interview/live/${data.id}`);
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

        <TopicSelector
          value={problemId}
          onChange={setProblemId}
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
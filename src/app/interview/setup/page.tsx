"use client";

import { useState } from "react";
import {
  useRouter,
  useSearchParams,
} from "next/navigation";

import CompanySelector from "@/src/features/interview/setup/components/CompanySelector";
import DifficultySelector from "@/src/features/interview/setup/components/DifficultySelector";
import DurationSelector from "@/src/features/interview/setup/components/DurationSelector";
import SetupCard from "@/src/features/interview/setup/components/SetupCard";
import { useToast } from "@/src/components/ui/Toast";

export default function InterviewSetupPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const problemId = searchParams.get("problemId");
  const interviewType =
    searchParams.get("type") ?? "hld";

  const [difficulty, setDifficulty] =
    useState("Medium");

  const [duration, setDuration] = useState(45);

  const [company, setCompany] =
    useState("Google");

  const [loading, setLoading] = useState(false);

  const { showToast } = useToast();

  async function handleStartInterview() {
    if (!problemId) {
      showToast("No interview problem selected.", "error");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        type: interviewType,
        difficulty,
        duration,
        company,
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
    <main className="min-h-screen bg-background px-6 py-12 text-foreground">
      <SetupCard>
        <h1 className="text-4xl font-bold">
          Interview Setup
        </h1>

        <p className="mt-3 text-muted-foreground">
          Configure your interview before starting.
        </p>

        <div className="mt-10">
          <p className="text-sm uppercase tracking-wide text-muted-foreground">
            Interview Type
          </p>

          <h2 className="mt-2 text-2xl font-semibold capitalize">
            {interviewType}
          </h2>
        </div>

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

        <button
          type="button"
          disabled={loading || !problemId}
          onClick={handleStartInterview}
          className="mt-10 w-full rounded-lg bg-zinc-900 py-4 text-lg font-semibold hover:bg-zinc-800 disabled:opacity-50 text-white"
        >
          {loading
            ? "Starting..."
            : "Start Interview"}
        </button>
      </SetupCard>
    </main>
  );
}
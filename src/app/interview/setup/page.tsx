"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import CompanySelector from "@/src/components/interview/setup/CompanySelector";
import DifficultySelector from "@/src/components/interview/setup/DifficultySelector";
import DurationSelector from "@/src/components/interview/setup/DurationSelector";
import SetupCard from "@/src/components/interview/setup/SetupCard";

export default function InterviewSetupPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const interviewType = searchParams.get("type") ?? "hld";

  const [difficulty, setDifficulty] = useState("Medium");
  const [duration, setDuration] = useState(45);
  const [company, setCompany] = useState("Google");
  const [loading, setLoading] = useState(false);

  async function handleStartInterview() {
    try {
      setLoading(true);

      const payload = {
        type: interviewType,
        difficulty,
        duration,
        company,
      };

      console.log("Request payload:", payload);

      const response = await fetch("/api/interviews/start", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    type: interviewType,
    difficulty,
    duration,
    company,
  }),
});

      const text = await response.text();

      console.log("Status:", response.status);
      console.log("Response:", text);

      if (!response.ok) {
  alert(text);
  console.error(text);
  return;
}

      if (text.startsWith("<!DOCTYPE") || text.startsWith("<html")) {
  console.error("Server returned HTML instead of JSON");
  console.error(text);
  return;
}

const interview = JSON.parse(text);

router.push(`/interview/live/${interview.id}`);
    } catch (error) {
      console.error(error);

      alert(
        error instanceof Error
          ? error.message
          : "Unknown error"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-zinc-950 px-6 py-12 text-white">
      <SetupCard>
        <h1 className="text-4xl font-bold">
          Interview Setup
        </h1>

        <p className="mt-3 text-zinc-400">
          Configure your interview before starting.
        </p>

        <div className="mt-10">
          <p className="text-sm uppercase tracking-wide text-zinc-500">
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
          disabled={loading}
          onClick={handleStartInterview}
          className="mt-10 w-full rounded-lg bg-blue-600 py-4 text-lg font-semibold hover:bg-blue-500 disabled:opacity-50"
        >
          {loading ? "Starting..." : "Start Interview"}
        </button>
      </SetupCard>
    </main>
  );
}
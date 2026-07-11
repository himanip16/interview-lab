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

  async function handleStartInterview() {
    console.log("Sending request to /api/interview/start"); // Add this line
  
    const response = await fetch("/api/interview/start", {
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

if (!response.ok) {
  throw new Error(await response.text());
}
console.log(response.status);

    const interview = await response.json();

    router.push(`/interview/live/${interview.id}`);
  }

  return (
    <main className="min-h-screen bg-zinc-950 px-6 py-12 text-white">
      <SetupCard>
        <h1 className="text-4xl font-bold">Interview Setup</h1>

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
          onClick={handleStartInterview}
          className="mt-10 w-full rounded-lg bg-blue-600 py-4 text-lg font-semibold hover:bg-blue-500"
        >
          Start Interview
        </button>
      </SetupCard>
    </main>
  );
}
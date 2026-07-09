"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";

import CompanySelector from "@/components/interview/CompanySelector";
import DifficultySelector from "@/components/interview/DifficultySelector";
import DurationSelector from "@/components/interview/DurationSelector";
import SetupCard from "@/components/interview/SetupCard";

export default function InterviewSetupPage() {
    const params = useSearchParams();

    const interviewType =
        params.get("type") ?? "hld";

    const [difficulty, setDifficulty] =
        useState("Medium");

    const [duration, setDuration] =
        useState(45);

    const [company, setCompany] =
        useState("Google");

    return (
        <main className="min-h-screen bg-zinc-950 p-10 text-white">

            <SetupCard>

                <h1 className="text-4xl font-bold">
                    Interview Setup
                </h1>

                <p className="mt-3 text-zinc-400">
                    Configure your interview before starting.
                </p>

                <div className="mt-8">

                    <p className="text-zinc-400">
                        Interview
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
                    className="mt-10 w-full rounded-lg bg-blue-600 py-4 text-lg font-semibold hover:bg-blue-500"
                >
                    Start Interview
                </button>

            </SetupCard>

        </main>
    );
}
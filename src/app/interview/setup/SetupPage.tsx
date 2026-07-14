"use client";

import { useState, useTransition } from "react";
import { useSearchParams } from "next/navigation";

import SetupCard from "@/features/interview/setup/components/SetupCard";
import ProblemInventoryView from "@/features/interview/setup/components/ProblemInventoryView";
import InterviewTypeSelector from "@/features/interview/setup/components/InterviewTypeSelector";
import DifficultySelector from "@/features/interview/setup/components/DifficultySelector";
import DurationSelector from "@/features/interview/setup/components/DurationSelector";
import TopicSelector from "@/features/interview/setup/components/TopicSelector";
import { Button } from "@/components/ui/Button";

import { createInterviewSession } from "./actions";
import {
  type InterviewType,
  type SetupDifficulty,
  parseInterviewType,
} from "@/features/interview/setup/types/setup";

type Props = {
  userId: string | null;
};

export default function SetupPage({ userId }: Props) {
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const problemId = searchParams.get("problemId");
  const type = searchParams.get("type");

  const [selectedProblem, setSelectedProblem] = useState<string | null>(problemId);
  const [selectedType, setSelectedType] = useState<InterviewType>(parseInterviewType(type));
  const [selectedDifficulty, setSelectedDifficulty] = useState<SetupDifficulty>("Medium");
  const [selectedDuration, setSelectedDuration] = useState<number>(30);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);

  const handleStartInterview = () => {
    if (!selectedProblem) {
      alert("Please select a problem");
      return;
    }

    // Use startTransition to handle the Server Action
    startTransition(async () => {
      await createInterviewSession({
        problemId: selectedProblem,
        difficulty: selectedDifficulty,
        userId: userId,
        type: selectedType
      });
    });
  };

  return (
    <SetupCard>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold mb-2">Setup Interview</h1>
          <p className="text-muted-foreground">Configure your practice session</p>
        </div>

        <ProblemInventoryView
          userId={userId}
          onSelectProblem={setSelectedProblem}
        />

        <InterviewTypeSelector
          value={selectedType}
          onChange={setSelectedType}
          onTopicChange={setSelectedTopic}
        />

        <DifficultySelector
          value={selectedDifficulty}
          onChange={setSelectedDifficulty}
        />

        <DurationSelector
          value={selectedDuration}
          onChange={setSelectedDuration}
        />

        <TopicSelector
          value={selectedTopic}
          onChange={setSelectedTopic}
        />

        <Button
          className="w-full"
          disabled={!selectedProblem || isPending}
          onClick={handleStartInterview}
        >
          {isPending ? "Creating Session..." : "Start Interview"}
        </Button>
      </div>
    </SetupCard>
  );
}
// src/app/interview/setup/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import SetupCard from "@/features/interview/setup/components/SetupCard";
import ProblemInventoryView from "@/features/interview/setup/components/ProblemInventoryView";
import InterviewTypeSelector from "@/features/interview/setup/components/InterviewTypeSelector";
import DifficultySelector from "@/features/interview/setup/components/DifficultySelector";
import DurationSelector from "@/features/interview/setup/components/DurationSelector";
import TopicSelector from "@/features/interview/setup/components/TopicSelector";
import { Button } from "@/components/ui/Button";
import { getCurrentUserId } from "@/modules/auth/getCurrentUserId";
import { type InterviewType, type SetupDifficulty, parseInterviewType } from "@/features/interview/setup/types/setup";

export default function InterviewSetupPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const problemId = searchParams.get("problemId");
  const type = searchParams.get("type");

  const [selectedProblem, setSelectedProblem] = useState<string | null>(problemId);
  const [selectedType, setSelectedType] = useState<InterviewType>(parseInterviewType(type));
  const [selectedDifficulty, setSelectedDifficulty] = useState<SetupDifficulty>("Medium");
  const [selectedDuration, setSelectedDuration] = useState<number>(30);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    getCurrentUserId().then(setUserId);
  }, []);

  const handleStartInterview = () => {
    if (!selectedProblem) {
      alert("Please select a problem");
      return;
    }
    
    const params = new URLSearchParams();
    params.append("problemId", selectedProblem);
    params.append("type", selectedType);
    params.append("difficulty", selectedDifficulty);
    params.append("duration", selectedDuration.toString());
    if (selectedTopic) params.append("topic", selectedTopic);
    
    router.push(`/interview/live?${params.toString()}`);
  };

  return (
    <SetupCard>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold mb-2">Setup Interview</h1>
          <p className="text-muted-foreground">Configure your practice session</p>
        </div>

        <ProblemInventoryView
          onSelectProblem={setSelectedProblem}
          userId={userId}
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
          onClick={handleStartInterview}
          disabled={!selectedProblem}
          className="w-full"
        >
          Start Interview
        </Button>
      </div>
    </SetupCard>
  );
}

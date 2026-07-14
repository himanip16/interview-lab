"use client";

import ProblemSelector from "@/features/interview/setup/components/ProblemSelector";

type Props = {
  onSelectProblem?: (problemId: string) => void;
  userId?: string | null;
};

export default function ProblemInventoryView({ onSelectProblem, userId }: Props) {
  return (
    <ProblemSelector
      value={null}
      onChange={(problemId) => {
        if (onSelectProblem && problemId) {
          onSelectProblem(problemId);
        }
      }}
      userId={userId}
    />
  );
}

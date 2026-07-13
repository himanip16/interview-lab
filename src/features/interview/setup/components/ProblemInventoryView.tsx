"use client";

import ProblemSelector from "@/src/features/interview/setup/components/ProblemSelector";

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
      onSearch={() => {}}
      userId={userId}
    />
  );
}

"use client";

import ProblemSelector from "@/features/interview/setup/components/ProblemSelector";

type Props = {
  value?: string | null;  // Add this
  onSelectProblem?: (problemId: string) => void;
  userId?: string | null;
};

export default function ProblemInventoryView({ 
  value,  // Add this parameter
  onSelectProblem, 
  userId 
}: Props) {
  return (
    <ProblemSelector
      value={value}  // Pass it through
      onChange={(problemId) => {
        if (onSelectProblem && problemId) {
          onSelectProblem(problemId);
        }
      }}
      userId={userId}
    />
  );
}
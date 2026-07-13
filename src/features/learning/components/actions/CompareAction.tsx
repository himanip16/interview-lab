import { useState } from "react";

import { Action, CompareActionContent } from "../../types/learning";

interface CompareActionProps {
  action: Action;
  onComplete: () => void;
}

export function CompareAction({ action, onComplete }: CompareActionProps) {
  const [selectedChoice, setSelectedChoice] = useState<"A" | "B" | null>(null);
  const [showReflection, setShowReflection] = useState(false);

  const content = action.content as CompareActionContent;
  const candidateA = content?.candidateA || "Candidate A not available.";
  const candidateB = content?.candidateB || "Candidate B not available.";
  const correctChoice = content?.correctChoice;
  const reflection = content?.reflection || "No reflection available.";

  const handleSelect = (choice: "A" | "B") => {
    setSelectedChoice(choice);
    setShowReflection(true);
  };

  const handleContinue = () => {
    onComplete();
  };

  const isCorrect = selectedChoice === correctChoice;

  return (
    <div className="border border-border rounded-lg p-6 bg-card">
      <h3 className="text-lg font-semibold mb-2">{action.title}</h3>
      {action.instructions && (
        <p className="text-sm text-muted-foreground mb-4">{action.instructions}</p>
      )}

      {!showReflection ? (
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => handleSelect("A")}
            className="p-4 border border-border rounded hover:bg-accent transition-colors text-left"
          >
            <p className="font-semibold mb-2">Candidate A</p>
            <p className="text-sm">{candidateA}</p>
          </button>
          <button
            onClick={() => handleSelect("B")}
            className="p-4 border border-border rounded hover:bg-accent transition-colors text-left"
          >
            <p className="font-semibold mb-2">Candidate B</p>
            <p className="text-sm">{candidateB}</p>
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div
            className={`p-4 rounded ${
              isCorrect
                ? "bg-green-950 border border-green-800"
                : "bg-red-950 border border-red-800"
            }`}
          >
            <p className="font-semibold mb-2">
              {isCorrect ? "✓ Correct" : "✗ Incorrect"}
            </p>
            <p className="text-sm">
              You chose: {selectedChoice === "A" ? "Candidate A" : "Candidate B"}
            </p>
          </div>

          <div className="prose prose-sm dark:prose-invert max-w-none">
            <p>{reflection}</p>
          </div>

          <button
            onClick={handleContinue}
            className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors"
          >
            Continue
          </button>
        </div>
      )}
    </div>
  );
}

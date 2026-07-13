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

  const handleSelect = (choice: "A" | "B") => {
    setSelectedChoice(choice);
    setShowReflection(true);
  };

  const handleContinue = () => {
    onComplete();
  };

  const isCorrect = selectedChoice === content.correctChoice;

  return (
    <div className="border border-border rounded-lg p-6 bg-card">
      <h3 className="text-lg font-semibold mb-2">{action.title}</h3>
      {action.instructions && (
        <p className="text-sm text-muted-foreground mb-4">{action.instructions}</p>
      )}
      
      <div className="prose prose-sm dark:prose-invert max-w-none mb-6">
        <p>{content.question}</p>
      </div>

      {!showReflection ? (
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => handleSelect("A")}
            className="p-4 border border-border rounded hover:bg-accent transition-colors text-left"
          >
            <p className="font-semibold mb-2">{content.candidateA.name}</p>
            <p className="text-sm">{content.candidateA.answer}</p>
          </button>
          <button
            onClick={() => handleSelect("B")}
            className="p-4 border border-border rounded hover:bg-accent transition-colors text-left"
          >
            <p className="font-semibold mb-2">{content.candidateB.name}</p>
            <p className="text-sm">{content.candidateB.answer}</p>
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
              You chose: {selectedChoice === "A" ? content.candidateA.name : content.candidateB.name}
            </p>
          </div>

          <div className="prose prose-sm dark:prose-invert max-w-none">
            <p>{content.reflection}</p>
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

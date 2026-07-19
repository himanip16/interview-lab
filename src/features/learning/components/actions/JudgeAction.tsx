import { useState } from "react";

import { Action, JudgeActionContent } from "../../types/learning";

interface JudgeActionProps {
  action: Action;
  onComplete: (response?: unknown) => void;
}

export function JudgeAction({ action, onComplete }: JudgeActionProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showReflection, setShowReflection] = useState(false);

  const content = action.content as JudgeActionContent;
  const options = content?.options || [];
  const correctOptionId = content?.correctOptionId;
  const reflection = content?.reflection || "No reflection available.";

  const handleSelect = (optionId: string) => {
    setSelectedOption(optionId);
    setShowReflection(true);
  };

  const handleContinue = () => {
    onComplete({ selectedOption, isCorrect });
  };

  const isCorrect = selectedOption === correctOptionId;
  const selectedOptionData = options.find((opt) => opt.id === selectedOption);

  return (
    <div className="border border-border rounded-lg p-6 bg-card">
      <h3 className="text-lg font-semibold mb-2">{action.title}</h3>
      {action.instructions && (
        <p className="text-sm text-muted-foreground mb-4">{action.instructions}</p>
      )}

      {!showReflection ? (
        <div className="space-y-2">
          {options.map((option) => (
            <button
              key={option.id}
              onClick={() => handleSelect(option.id)}
              className="w-full text-left px-4 py-3 border border-border rounded hover:bg-accent transition-colors"
            >
              {option.text}
            </button>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          <div
            className={`p-4 rounded ${
              isCorrect
                ? "bg-success/10 border border-success/30 text-success-foreground"
                : "bg-error/10 border border-error/30 text-error-foreground"
            }`}
          >
            <p className="font-semibold mb-2">
              {isCorrect ? "✓ Correct" : "✗ Incorrect"}
            </p>
            <p className="text-sm">{selectedOptionData?.text}</p>
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

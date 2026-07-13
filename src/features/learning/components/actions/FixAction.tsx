import { useState } from "react";

import { Action, FixActionContent } from "../../types/learning";

interface FixActionProps {
  action: Action;
  onComplete: () => void;
}

export function FixAction({ action, onComplete }: FixActionProps) {
  const [answer, setAnswer] = useState("");
  const [showReflection, setShowReflection] = useState(false);

  const content = action.content as FixActionContent;

  const handleSubmit = () => {
    if (answer.trim()) {
      setShowReflection(true);
    }
  };

  const handleContinue = () => {
    onComplete();
  };

  return (
    <div className="border border-border rounded-lg p-6 bg-card">
      <h3 className="text-lg font-semibold mb-2">{action.title}</h3>
      {action.instructions && (
        <p className="text-sm text-muted-foreground mb-4">{action.instructions}</p>
      )}
      
      <div className="prose prose-sm dark:prose-invert max-w-none mb-6">
        <p>{content.question}</p>
      </div>

      <div className="mb-6 p-4 bg-muted rounded border border-border">
        <p className="text-sm font-semibold mb-2">Flawed Answer:</p>
        <p className="text-sm">{content.flawedAnswer}</p>
      </div>

      {!showReflection ? (
        <div className="space-y-4">
          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Enter your fix..."
            className="w-full min-h-[100px] px-3 py-2 border border-border rounded bg-background text-foreground"
            rows={4}
          />
          <button
            onClick={handleSubmit}
            disabled={!answer.trim()}
            className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Submit
          </button>
        </div>
      ) : (
        <div className="space-y-4">
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
